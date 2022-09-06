import {Request, Router} from 'express';
import prisma from "../db/prisma";
import {
    BaseResponseData,
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, getUserData, TypedResponse} from "../common";
import {validateWorkspaceCreateRequest, WorkspaceCreateRequest} from "../../../shared/src/api/workspaces";
import { UserRole } from '@prisma/client';
import {WorkspaceListResponseData} from "@elr0berto/robert-learns-shared/dist/api/models/WorkspaceListResponse";

const workspaces = Router();

workspaces.get('/', async (req, res : TypedResponse<WorkspaceListResponseData>) => {
    let user = await getSignedInUser(req.session);

    const workspaces = await prisma.workspace.findMany({
        where: {
            users: {
                some: {
                    userId: user.id,
                }
            }
        },
        include: { users : true },
    });

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
        workspaces: workspaces.map(w => ({
            id: w.id,
            name: w.name,
            description: w.description
        }))
    })
});
workspaces.post('/create', async (req: Request<{}, {}, WorkspaceCreateRequest>, res : TypedResponse<BaseResponseData>) => {
    let user = await getSignedInUser(req.session);

    if (user.isGuest) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Guest users are not allowed to create workspaces. please sign in first!',
            user: null,
        });
    }

    const errors = validateWorkspaceCreateRequest(req.body);

    if (errors.length !== 0) {
        return res.json({
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join(', '),
            user: null,
        });
    }

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

    user = await getSignedInUser(req.session);
    console.log('user', user);

    return res.json({
        status: ResponseStatus.Success,
        user: getUserData(user),
        errorMessage: null,
    });
});

export default workspaces;