import {Request, Router} from 'express';
import prisma from "../db/prisma";
import {
    BaseResponseData,
    ResponseStatus
} from "@elr0berto/robert-learns-shared/src/api/models/BaseResponse";
import {getSignedInUser, getUserData, TypedResponse} from "../common";
import bcrypt from 'bcryptjs';
import {validateWorkspaceCreateRequest, WorkspaceCreateRequest} from "../../../shared/src/api/workspaces";

const workspaces = Router();

workspaces.post('/', async (req: Request<{}, {}, WorkspaceCreateRequest>, res : TypedResponse<BaseResponseData>) => {
    const user = await getSignedInUser(req.session);

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

    return res.json({
        status: ResponseStatus.Success,
        user: null,
        errorMessage: null,
    });
});

export default workspaces;