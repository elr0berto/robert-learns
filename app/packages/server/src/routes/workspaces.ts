import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getWorkspaceData, TypedResponse} from "../common.js";
import {UserRole as PrismaUserRole} from '@prisma/client';
import {BaseResponseData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {
    CreateWorkspaceRequest,
    CreateWorkspaceResponseData,
    DeleteWorkspaceRequest,
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
import logger, {logWithRequest} from "../logger.js";

const workspaces = Router();

workspaces.post('/get-workspaces', async (req, res : TypedResponse<GetWorkspacesResponseData>, next) => {
    try {
        const user = await getSignedInUser(req.session);
        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { allowGuests: true },
                    {
                        users: {
                            some: {
                                userId: user?.id ?? -1 // if user is not signed in we look for non-existing user-id = -1 ... hacky but works.. looking for null|undefined returns all workspaces...
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

workspaces.post('/create-workspace', async (req: Request<unknown, unknown, CreateWorkspaceRequest>, res : TypedResponse<CreateWorkspaceResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to create or edit workspaces. please sign in first!');
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
            logWithRequest('error', req, 'You are not allowed to create or edit workspaces.');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to create or edit workspaces.',
                workspaceData: null,
            });
        }

        const errors = validateCreateWorkspaceRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'Create workspace request validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                workspaceData: null,
            });
        }

        const userIds = req.body.workspaceUsers.map(u => u.userId);
        if (arrayUnique(userIds).length !== userIds.length) {
            logWithRequest('error', req, 'userIds are not unique: ' + userIds.join(', '));
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'userIds are not unique: ' + userIds.join(', '),
                workspaceData: null,
            });
        }


        let workspaceId = req.body.workspaceId;

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

            for (const permissionUser of req.body.workspaceUsers) {
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
        } else {
            const existingWorkspace = await prisma.workspace.findUniqueOrThrow({
                where: {id: workspaceId}
            });

            if (existingWorkspace.name !== req.body.name || existingWorkspace.description !== req.body.description || existingWorkspace.allowGuests !== req.body.allowGuests) {
                await prisma.workspace.update({
                    where: {
                        id: workspaceId,
                    },
                    data: {
                        name: req.body.name,
                        description: req.body.description,
                        allowGuests: req.body.allowGuests,
                    }
                });
            }

            const signedInWorkspaceUser = await getWorkspaceUser(signedInUser, existingWorkspace);

            const existingWorkspaceUsers = await prisma.workspaceUser.findMany({
                where: {
                    workspaceId: workspaceId
                },
                include: {
                    user: true,
                }
            });

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
                            logWithRequest('error', req, 'Access denied, canUserChangeUserRoleRole', {signedInWorkspaceUser, existingWorkspaceUser, newWorkspaceUser});
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
                        logWithRequest('error', req, 'Access denied, canUserDeleteWorkspaceUser', {signedInWorkspaceUser, existingWorkspaceUser});
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

            // Add new workspaceUsers from req.body.workspaceUsers if they don't exist yet
            for (const newWorkspaceUser of req.body.workspaceUsers) {
                const matches = existingWorkspaceUsers.filter(wu => wu.user.id === newWorkspaceUser.userId);

                if (matches.length > 1) {
                    throw new Error('found ' + matches.length + ' matches for workspace user id: ' + newWorkspaceUser.userId);
                }

                if (matches.length === 0) {
                    // add new
                    if (!Object.values(PrismaUserRole).includes(newWorkspaceUser.role)) {
                        throw new Error('invalid role: ' + newWorkspaceUser.role);
                    }

                    await prisma.user.findUniqueOrThrow({
                        where: {id: newWorkspaceUser.userId}
                    });

                    if (!workspaceId) {
                        throw new Error('workspaceId is: ' + workspaceId);
                    }

                    await prisma.workspaceUser.create({
                        data: {
                            workspaceId: workspaceId,
                            userId: newWorkspaceUser.userId,
                            role: newWorkspaceUser.role,
                        }
                    });
                }
            }
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

workspaces.post('/delete-workspace', async (req: Request<unknown, unknown, DeleteWorkspaceRequest>, res : TypedResponse<BaseResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to delete workspaces.');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to delete workspaces.',
            });
        }

        if (!await checkPermissions({
            user: signedInUser,
            workspaceId: req.body.workspaceId,
            capability: Capability.DeleteWorkspace,
        })) {
            logWithRequest('error', req, 'You are not allowed to delete this workspace');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to delete this workspace',
            });
        }

        const resp = await prisma.$transaction(async tx => {
            const workspace = await tx.workspace.findUniqueOrThrow({
                where: {
                    id: req.body.workspaceId
                },
                include: {
                    users: true,
                    cardSets: true,
                },
            });

            if (workspace.cardSets.length > 0) {
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UserError,
                    errorMessage: 'Cannot delete workspace with card sets. Please delete all card sets first.',
                });
            }
            // loop over workspace.users
            for (const workspaceUser of workspace.users) {
                await tx.workspaceUser.delete({
                    where: {
                        workspaceId_userId: {
                            workspaceId: workspace.id,
                            userId: workspaceUser.userId,
                        },
                    }
                });
            }

            await tx.workspace.delete({
                where: {
                    id: req.body.workspaceId
                }
            });

            return res.json({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
            });
        });

        return resp;
    } catch (ex) {
        console.error('/workspaces/delete-workspace caught ex', ex);
        next(ex);
        return;
    }
});

export default workspaces;