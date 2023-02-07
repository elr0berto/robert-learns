import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getGuestUser, getPermissionUsersFromWorkspace, getSignedInUser, getUserData, TypedResponse} from "../common.js";
import { UserRole } from '@prisma/client';
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';
import {validateWorkspaceCardSetCreateRequest, validateWorkspaceCreateRequest, WorkspaceCardSetCreateRequest,
    WorkspaceCardSetCreateResponseData,
    WorkspaceCardSetListResponseData, WorkspaceCreateRequest, WorkspaceCreateResponseData, WorkspaceListResponseData } from '@elr0berto/robert-learns-shared/api/workspaces';
import {canUserWriteToWorkspaceId} from "../security.js";

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
            users: getPermissionUsersFromWorkspace(w),
        }))
    });
});

workspaces.post('/create', async (req: Request<{}, {}, WorkspaceCreateRequest>, res : TypedResponse<WorkspaceCreateResponseData>) => {
    let user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create workspaces. please sign in first!',
            signedInUser: null,
            workspaceData: null,
        });
    }

    const errors = validateWorkspaceCreateRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            signedInUser: null,
            workspaceData: null,
        });
    }

    let newWorkspace = await prisma.workspace.create({
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

    user = await getSignedInUser(req.session);

    return res.json({
        status: ResponseStatus.Success,
        signedInUser: getUserData(user),
        errorMessage: null,
        workspaceData: {
            id: newWorkspace.id,
            name: newWorkspace.name,
            description: newWorkspace.description,
            users: getPermissionUsersFromWorkspace(newWorkspace), // TODO: Make a function to get workspace data from workspace.id including fetching from DB and use above too when geting workspace list
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

    const hasRights = canUserWriteToWorkspaceId(user,req.body.workspaceId);
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