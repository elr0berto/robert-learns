import {Request, Router} from 'express';
import prisma from "../db/prisma.js";
import {getSignedInUser, getUserData, TypedResponse} from "../common.js";
import {
    GetUsersRequest, GetUsersResponseData,
    UserGetByEmailRequest,
    UserGetByEmailResponseData, validateGetUsersRequest,
    validateUserGetByEmailRequest
} from "@elr0berto/robert-learns-shared/api/users";
import { ResponseStatus } from '@elr0berto/robert-learns-shared/api/models';
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
const users = Router();

users.post('/getByEmail', async (req : Request<unknown,unknown,UserGetByEmailRequest>, res : TypedResponse<UserGetByEmailResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);
    if (signedInUser === null) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: 'Not signed in.',
            userData: null,
        });
    }

    const errors = validateUserGetByEmailRequest(req.body);

    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: 'Invalid email: ' + errors.join(', ') + ' ' + JSON.stringify(req.params),
            userData: null,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        },
    });

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        userData: user === null ? null : getUserData(user),
    });
});

users.post('/getUsers', async (req : Request<unknown,unknown,GetUsersRequest>, res : TypedResponse<GetUsersResponseData>) => {
    const signedInUser = await getSignedInUser(req.session);

    const errors = validateGetUsersRequest(req.body);

    if (errors.length > 0) {
        return res.json({
            dataType: true,
            status: ResponseStatus.UserError,
            errorMessage: errors.join(', ') + ' ' + JSON.stringify(req.params),
            userDatas: [],
        });
    }

    const users = await prisma.user.findMany({
        where: {
            id: {
                in: req.body.userIds
            }
        },
        include: {
            workspaces: true
        }
    });

    // loop over users and check if signed in user can view any of each users workspaces
    for (const user of users) {
        let canViewAnyWorkspace = false;
        for (const workspace of user.workspaces) {
            if (await checkPermissions({user: signedInUser, workspaceId: workspace.workspaceId, capability: Capability.ViewWorkspace})) {
                canViewAnyWorkspace = true;
                break;
            }
        }
        if (!canViewAnyWorkspace) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to view any of the workspaces for user id: ' + user.id,
                userDatas: [],
            });
        }
    }

    return res.json({
        dataType: true,
        status: ResponseStatus.Success,
        errorMessage: null,
        userDatas: users.map(u => getUserData(u)),
    });
});

export default users;