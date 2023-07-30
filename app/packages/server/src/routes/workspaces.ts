import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getWorkspaceData, TypedResponse} from "../common.js";
import {UserRole as PrismaUserRole} from '@prisma/client';
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateWorkspaceRequest,
    CreateWorkspaceResponseData,
    GetWorkspacesResponseData,
    validateCreateWorkspaceRequest
} from '@elr0berto/robert-learns-shared/api/workspaces';
import {arrayUnique} from '@elr0berto/robert-learns-shared/common';
import {getWorkspaceUser} from "../db/helpers/workspace-users.js";
import {
    canUserChangeUserRoleRole,
    canUserDeleteWorkspaceUser,
    Capability
} from "@elr0berto/robert-learns-shared/permissions";
import {checkPermissions} from "../permissions.js";

const workspaces = Router();

workspaces.post('/get', async (req, res : TypedResponse<GetWorkspacesResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);

        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { allowGuests: true },
                    {
                        users: {
                            some: {
                                userId: user?.id
                            }
                        }
                    }
                ]
            },
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            workspaceDatas: workspaces.map(w => getWorkspaceData(w)),
        });
    } catch (ex) {
        console.error('/workspaces/get caught ex', ex);
        next(ex);
        return;
    }
});

workspaces.post('/create', async (req: Request<unknown, unknown, CreateWorkspaceRequest>, res : TypedResponse<CreateWorkspaceResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        if (signedInUser === null) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to create or edit workspaces. please sign in first!',
                workspaceData: null,
            });
        }

        const scope = req.body.workspaceId ? 'edit' : 'create';

        if (!await checkPermissions({
            user: signedInUser,
            workspaceId: req.body.workspaceId,
            capability: scope === 'edit' ? Capability.EditWorkspace : Capability.CreateWorkspace
        })) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to create or edit workspaces.',
                workspaceData: null,
            });
        }

        const errors = validateCreateWorkspaceRequest(req.body);

        if (errors.length !== 0) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                workspaceData: null,
            });
        }

        const userIds = req.body.workspaceUsers.map(u => u.userId);
        if (arrayUnique(userIds).length !== userIds.length) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'userIds are not unique: ' + userIds.join(', '),
                workspaceData: null,
            });
        }


        let workspaceId = req.body.workspaceId;

        const existingWorkspaceUsers = await prisma.workspaceUser.findMany({
            where: {
                workspaceId: req.body.workspaceId
            },
            include: {
                user: true,
            }
        });

        if (scope === 'create') {
            const newWorkspace = await prisma.workspace.create({
                data: {
                    name: req.body.name,
                    description: req.body.description,
                    allowGuests: req.body.allowGuests,
                }
            });

            workspaceId = newWorkspace.id;

            await prisma.workspaceUser.create({
                data: {
                    workspaceId: newWorkspace.id,
                    userId: signedInUser.id,
                    role: PrismaUserRole.OWNER,
                }
            });
        } else {
            const existingWorkspace = await prisma.workspace.findUniqueOrThrow({
                where: {id: req.body.workspaceId}
            });

            if (existingWorkspace.name !== req.body.name || existingWorkspace.description !== req.body.description || existingWorkspace.allowGuests !== req.body.allowGuests) {
                await prisma.workspace.update({
                    where: {
                        id: req.body.workspaceId,
                    },
                    data: {
                        name: req.body.name,
                        description: req.body.description,
                        allowGuests: req.body.allowGuests,
                    }
                });
            }

            const signedInWorkspaceUser = await getWorkspaceUser(signedInUser, existingWorkspace);

            for (const existingWorkspaceUser of existingWorkspaceUsers) {
                const matches = req.body.workspaceUsers.filter(wu => wu.userId === existingWorkspaceUser.user.id);

                if (matches.length > 1) {
                    throw new Error('found ' + matches.length + ' matches for workspace user id: ' + existingWorkspaceUser.user.id);
                }

                if (matches.length === 1) {
                    // update existing
                    const newWorkspaceUser = matches[0];

                    if (existingWorkspaceUser.role !== newWorkspaceUser.role) {
                        if (!canUserChangeUserRoleRole(signedInWorkspaceUser, existingWorkspaceUser, newWorkspaceUser.role)) {
                            return res.json({
                                dataType: true,
                                status: ResponseStatus.UnexpectedError,
                                errorMessage: 'Access denied',
                                workspaceData: null,
                            });
                        }
                        await prisma.workspaceUser.update({
                            where: {
                                workspaceId_userId: {
                                    workspaceId: existingWorkspace.id,
                                    userId: existingWorkspaceUser.userId,
                                },
                            },
                            data: {
                                role: newWorkspaceUser.role,
                            }
                        });
                    }
                } else if (matches.length === 0) {
                    // delete existing
                    if (!canUserDeleteWorkspaceUser(signedInWorkspaceUser, existingWorkspaceUser)) {
                        return res.json({
                            dataType: true,
                            status: ResponseStatus.UnexpectedError,
                            errorMessage: 'Access denied',
                            workspaceData: null,
                        });
                    }
                    await prisma.workspaceUser.delete({
                        where: {
                            workspaceId_userId: {
                                workspaceId: existingWorkspace.id,
                                userId: existingWorkspaceUser.userId,
                            },
                        }
                    });
                }
            }
        }

        for (const permissionUser of req.body.workspaceUsers) {
            const existing = existingWorkspaceUsers.filter(wu => wu.userId === permissionUser.userId);
            if (existing.length > 0) {
                if (scope === 'create') {
                    throw new Error('user already exists. userid: ' + permissionUser.userId);
                } else if (scope === 'edit') {
                    continue;
                } else {
                    throw new Error('invalid scope: ' + scope);
                }
            }

            if (!Object.values(PrismaUserRole).includes(permissionUser.role)) {
                throw new Error('invalid role: ' + permissionUser.role);
            }

            await prisma.user.findUniqueOrThrow({
                where: {id: permissionUser.userId}
            });

            if (!workspaceId) {
                throw new Error('workspaceId is: ' + workspaceId);
            }

            await prisma.workspaceUser.create({
                data: {
                    workspaceId: workspaceId,
                    userId: permissionUser.userId,
                    role: permissionUser.role,
                }
            });
        }

        const workspace = await prisma.workspace.findUniqueOrThrow({
            where: {
                id: workspaceId
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            },
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            workspaceData: getWorkspaceData(workspace),
        });
    } catch (ex) {
        console.error('/workspaces/create caught ex', ex);
        next(ex);
        return;
    }
});

export default workspaces;