import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {
    canUserChangeUserRoleRole,
    canUserDeleteWorkspaceUser, getCardSetData,
    getGuestUser,
    getPermissionUsersFromWorkspace,
    getSignedInUser,
    getUserData,
    getUsersMyRoleForWorkspace, getWorkspaceData,
    TypedResponse
} from "../common.js";
import { UserRole } from '@prisma/client';
import {CardSet, CardSetData, ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {validateWorkspaceCardSetCreateRequest, validateWorkspaceCreateRequest, WorkspaceCardSetCreateRequest,
    WorkspaceCardSetCreateResponseData,
    WorkspaceCardSetListResponseData, WorkspaceCreateRequest, WorkspaceCreateResponseData, WorkspaceListResponseData } from '@elr0berto/robert-learns-shared/api/workspaces';
import {canUserAdministerWorkspace, canUserContributeToWorkspaceId, canUserViewWorkspaceId} from "../security.js";
import { arrayUnique } from '@elr0berto/robert-learns-shared/common';
import {getWorkspaceUser} from "../db/helpers/workspace-users.js";

const workspaces = Router();

workspaces.get('/', async (req, res : TypedResponse<WorkspaceListResponseData>) => {
    const user = await getSignedInUser(req.session);

    const userIds = [user.id];
    if (!user.isGuest) {
        const guestUser = await getGuestUser();
        userIds.push(guestUser.id);
    }

    const workspaces = await prisma.workspace.findMany({
        where: {
            users: {
                some: {
                    userId: { in: userIds }
                }
            }
        },
        include: {
            users : {
                include: {
                    user: true
                }
            }
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        workspaceDatas: workspaces.map(w => getWorkspaceData(w, user)),
    });
});

workspaces.post('/create', async (req: Request<{}, {}, WorkspaceCreateRequest>, res : TypedResponse<WorkspaceCreateResponseData>) => {
    let signedInUser = await getSignedInUser(req.session);

    if (signedInUser.isGuest) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create workspaces. please sign in first!',
            signedInUserData: getUserData(signedInUser),
            workspaceData: null,
        });
    }

    const errors = validateWorkspaceCreateRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUserData: getUserData(signedInUser),
            workspaceData: null,
        });
    }

    const userIds = req.body.workspaceUsers.map(u => u.userId);
    if (arrayUnique(userIds).length !== userIds.length) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'userIds are not unique: ' + userIds.join(', '),
            signedInUserData: getUserData(signedInUser),
            workspaceData: null,
        });
    }

    const scope = req.body.workspaceId ? 'edit' : 'create';

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
            }
        });

        workspaceId = newWorkspace.id;

        const workspaceUser = await prisma.workspaceUser.create({
            data: {
                workspaceId: newWorkspace.id,
                userId: signedInUser.id,
                role: UserRole.OWNER,
            }
        });

        if (req.body.allowGuests) {
            const guest = await getGuestUser();
            await prisma.workspaceUser.create({
                data: {
                    workspaceId: newWorkspace.id,
                    userId: guest.id,
                    role: UserRole.USER,
                }
            });
        }
    } else {
        const existingWorkspace = await prisma.workspace.findUniqueOrThrow({
            where: { id: req.body.workspaceId }
        });

        const access = await canUserAdministerWorkspace(signedInUser, existingWorkspace);
        if (!access) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Access denied',
                signedInUserData: getUserData(signedInUser),
                workspaceData: null,
            });
        }

        if (existingWorkspace.name !== req.body.name || existingWorkspace.description !== req.body.description) {
            await prisma.workspace.update({
                where: {
                    id: req.body.workspaceId,
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                }
            });
        }

        if (req.body.allowGuests && existingWorkspaceUsers.findIndex(wu => wu.user.isGuest) === -1) {
            const guest = await getGuestUser();
            await prisma.workspaceUser.create({
                data: {
                    workspaceId: existingWorkspace.id,
                    userId: guest.id,
                    role: UserRole.USER,
                }
            });
        } else if (!req.body.allowGuests && existingWorkspaceUsers.findIndex(wu => wu.user.isGuest) !== -1) {
            const guest = await getGuestUser();
            await prisma.workspaceUser.delete({
                where: {
                    workspaceId_userId: {
                        workspaceId: existingWorkspace.id,
                        userId: guest.id,
                    },
                }
            })
        }

        const signedInWorkspaceUser = await getWorkspaceUser(signedInUser, existingWorkspace);

        for (const existingWorkspaceUser of existingWorkspaceUsers) {
            if (existingWorkspaceUser.user.isGuest) {
                continue;
            }
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
                            signedInUserData: getUserData(signedInUser),
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
                        signedInUserData: getUserData(signedInUser),
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

    for(const permissionUser of req.body.workspaceUsers) {
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

        if (!Object.values(UserRole).includes(permissionUser.role)) {
            throw new Error('invalid role: ' + permissionUser.role);
        }

        await prisma.user.findUniqueOrThrow({
            where: { id: permissionUser.userId }
        });

        await prisma.workspaceUser.create({
            data: {
                workspaceId: workspaceId!,
                userId: permissionUser.userId,
                role: permissionUser.role,
            }
        });
    }

    signedInUser = await getSignedInUser(req.session);

    const workspace = await prisma.workspace.findUniqueOrThrow({
        where: {
            id: workspaceId
        },
        include: {
            users : {
                include: {
                    user: true
                }
            }
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(signedInUser),
        errorMessage: null,
        workspaceData: getWorkspaceData(workspace, signedInUser),
    });
});

workspaces.get('/:workspaceId/card-sets', async (req, res : TypedResponse<WorkspaceCardSetListResponseData>) => {
    let user = await getSignedInUser(req.session);

    const hasRights = canUserViewWorkspaceId(user,req.body.workspaceId);
    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to view this workspace.',
            signedInUserData: null,
            cardSetDatas: null,
        });
    }

    const cardSets = await prisma.cardSet.findMany({
        where: {
            workspaceId: {
                equals: parseInt(req.params.workspaceId)
            }
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardSetDatas: cardSets.map(cs => getCardSetData(cs))
    });
});

workspaces.post('/card-set-create', async (req: Request<{}, {}, WorkspaceCardSetCreateRequest>, res : TypedResponse<WorkspaceCardSetCreateResponseData>) => {
    let user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create card sets. please sign in first!',
            signedInUserData: null,
            cardSetData: null,
        });
    }

    const errors = validateWorkspaceCardSetCreateRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUserData: null,
            cardSetData: null,
        });
    }

    const hasRights = canUserContributeToWorkspaceId(user,req.body.workspaceId);
    if (!hasRights) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to create card sets in this workspace.',
            signedInUserData: null,
            cardSetData: null,
        });
    }

    const scope = req.body.cardSetId ? 'edit' : 'create';

    let returnCardSetId : number;
    if (scope === 'create') {
        const returnCardSet = await prisma.cardSet.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                workspaceId: req.body.workspaceId,
            }
        });
        returnCardSetId = returnCardSet.id;
    } else {
        const existingCardSet = await prisma.cardSet.findUniqueOrThrow({
            where: {
                id: req.body.cardSetId,
            }
        });

        if (existingCardSet.workspaceId !== req.body.workspaceId) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Access denied',
                signedInUserData: null,
                cardSetData: null,
            });
        }

        if (existingCardSet.name !== req.body.name || existingCardSet.description !== req.body.description) {
            await prisma.cardSet.update({
                where: {
                    id: req.body.cardSetId,
                },
                data: {
                    name: req.body.name,
                    description: req.body.description,
                }
            });
        }
        returnCardSetId = existingCardSet.id;
    }

    user = await getSignedInUser(req.session);

    // TODO PREVENT TWO CARD SETS WITH SAME NAME IN SAME WORKSPACE
    asdasdsaasdasd

    const returnCardSet = await prisma.cardSet.findUniqueOrThrow({
        where: {
            id: returnCardSetId
        }
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        signedInUserData: getUserData(user),
        errorMessage: null,
        cardSetData: getCardSetData(returnCardSet),
    });
});

export default workspaces;