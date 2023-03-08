import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {
    getGuestUser,
    getPermissionUsersFromWorkspace,
    getSignedInUser,
    getUserData,
    getUsersMyRoleForWorkspace,
    TypedResponse
} from "../common.js";
import { UserRole } from '@prisma/client';
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {validateWorkspaceCardSetCreateRequest, validateWorkspaceCreateRequest, WorkspaceCardSetCreateRequest,
    WorkspaceCardSetCreateResponseData,
    WorkspaceCardSetListResponseData, WorkspaceCreateRequest, WorkspaceCreateResponseData, WorkspaceListResponseData } from '@elr0berto/robert-learns-shared/api/workspaces';
import {canUserAdministerWorkspace, canUserContributeToWorkspaceId} from "../security.js";
import { arrayUnique } from '@elr0berto/robert-learns-shared/common';

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
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        workspaces: workspaces.map(w => ({
            id: w.id,
            name: w.name,
            description: w.description,
            users: getPermissionUsersFromWorkspace(w, user),
            myRole: getUsersMyRoleForWorkspace(w, user),
        }))
    });
});

workspaces.post('/create', async (req: Request<{}, {}, WorkspaceCreateRequest>, res : TypedResponse<WorkspaceCreateResponseData>) => {
    let user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create workspaces. please sign in first!',
            signedInUser: user,
            workspaceData: null,
        });
    }

    const errors = validateWorkspaceCreateRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUser: user,
            workspaceData: null,
        });
    }

    const scope = req.body.workspaceId ? 'edit' : 'create';

    if (scope === 'create') {
        const newWorkspace = await prisma.workspace.create({
            data: {
                name: req.body.name,
                description: req.body.description,
            }
        });

        const workspaceUser = await prisma.workspaceUser.create({
            data: {
                workspaceId: newWorkspace.id,
                userId: user.id,
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

        const access = await canUserAdministerWorkspace(user, existingWorkspace);
        if (!access) {
            return res.json({
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Access denied',
                signedInUser: user,
                workspaceData: null,
            });
        }
        await prisma.workspace.update({
            where: {
                id: req.body.workspaceId,
            },
            data: {
                name: req.body.name,
                description: req.body.description,
            }
        });

        const existingWorkspaceUsers = await prisma.workspaceUser.findMany({
            where: {
                workspaceId: req.body.workspaceId
            },
            include: {
                user: true,
            }
        });

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
    }



    const userIds = req.body.workspaceUsers.map(u => u.userId);
    if (arrayUnique(userIds).length !== userIds.length) {
        throw new Error('userIds are not unique: ' + userIds.join(', '));
    }

    for(const permissionUser of req.body.workspaceUsers) {
        if (!Object.values(UserRole).includes(permissionUser.role)) {
            throw new Error('invalid role: ' + permissionUser.role);
        }

        await prisma.user.findUniqueOrThrow({
            where: { id: permissionUser.userId }
        });

        await prisma.workspaceUser.create({
            data: {
                workspaceId: newWorkspace.id,
                userId: permissionUser.userId,
                role: permissionUser.role,
            }
        });
    }

    user = await getSignedInUser(req.session);

    const workspace = await prisma.workspace.findUniqueOrThrow({
        where: {
            id: newWorkspace.id
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
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        workspaceData: {
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
            users: getPermissionUsersFromWorkspace(workspace, user),
            myRole: getUsersMyRoleForWorkspace(workspace, user)
        }
    });
});

workspaces.get('/:workspaceId/card-sets', async (req, res : TypedResponse<WorkspaceCardSetListResponseData>) => {
    let user = await getSignedInUser(req.session);

    // TODO : security check

    const cardSets = await prisma.cardSet.findMany({
        where: {
            workspaceId: {
                equals: parseInt(req.params.workspaceId)
            }
        },
    });

    return res.json({
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        cardSets: cardSets.map(cs => ({
            id: cs.id,
            name: cs.name,
        }))
    });
});

workspaces.post('/card-set-create', async (req: Request<{}, {}, WorkspaceCardSetCreateRequest>, res : TypedResponse<WorkspaceCardSetCreateResponseData>) => {
    let user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create card sets. please sign in first!',
            signedInUser: null,
            cardSetId: null,
        });
    }

    const errors = validateWorkspaceCardSetCreateRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUser: null,
            cardSetId: null,
        });
    }

    const hasRights = canUserContributeToWorkspaceId(user,req.body.workspaceId);
    if (!hasRights) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'You are not allowed to create card sets in this workspace.',
            signedInUser: null,
            cardSetId: null,
        });
    }

    const newCardSet = await prisma.cardSet.create({
        data: {
            name: req.body.name,
            workspaceId: req.body.workspaceId,
        }
    });

    const cardSetUser = await prisma.cardSetUser.create({
        data: {
            cardSetId: newCardSet.id,
            userId: user.id,
            role: UserRole.OWNER,
        }
    });

    user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        cardSetId: newCardSet.id,
    });
});

export default workspaces;