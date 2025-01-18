import {Request, Router} from 'express';
import {getSignedInUser, getWorkspaceUserData, TypedResponse} from "../common.js";
import {ResponseStatus, UserRolesInOrder} from '@elr0berto/robert-learns-shared/api/models';

import {
    AddWorkspaceUserRequest,
    AddWorkspaceUserResponseData,
    GetWorkspaceUsersRequest,
    GetWorkspaceUsersResponseData, validateAddWorkspaceUserRequest,
    validateGetWorkspaceUsersRequest
} from "@elr0berto/robert-learns-shared/api/workspace-users";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import prisma from "../db/prisma.js";
import {logWithRequest} from "../logger.js";
import {UserRole} from "@prisma/client";

const workspaceUsers = Router();

workspaceUsers.post('/get-workspace-users', async (req: Request<unknown, unknown, GetWorkspaceUsersRequest>, res : TypedResponse<GetWorkspaceUsersResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);

        const errors = validateGetWorkspaceUsersRequest(req.body);

        if (errors.length > 0) {
            return res.json({
                dataType: true,
                status: ResponseStatus.UserError,
                errorMessage: errors.join('.'),
                workspaceUserDatas: [],
            });
        }

        const workspaceIds = req.body.workspaceIds;

        // loop over the workspaceIds and check that the user has access to each one
        for (let i = 0; i < workspaceIds.length; i++) {
            if (!await checkPermissions({
                user: signedInUser,
                workspaceId: workspaceIds[i],
                capability: Capability.ViewWorkspace
            })) {
                logWithRequest('error', req, 'User is not allowed to view workspace id: ' + workspaceIds[i]);
                return res.json({
                    dataType: true,
                    status: ResponseStatus.UnexpectedError,
                    errorMessage: 'You are not allowed to view workspace id: ' + workspaceIds[i],
                    workspaceUserDatas: [],
                });
            }
        }

        const workspaceUsers = await prisma.workspaceUser.findMany({
            where: {
                workspaceId: {
                    in: workspaceIds
                }
            }
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            workspaceUserDatas: workspaceUsers.map(wu => getWorkspaceUserData(wu)).sort((a, b) => {
                return UserRolesInOrder.indexOf(a.role) - UserRolesInOrder.indexOf(b.role)
            }),
        });
    } catch (ex) {
        console.error('/workspace-users/get-workspace-users caught ex', ex);
        next(ex);
        return;
    }
});

// todo add a endpoint for inviting / adding a user to a workspace
workspaceUsers.post('/add-workspace-user', async (req: Request<unknown, unknown, AddWorkspaceUserRequest>, res : TypedResponse<AddWorkspaceUserResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);
        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to add users to workspaces.');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to add users to workspaces.',
                workspaceUserData: null,
            });
        }

        const errors = validateAddWorkspaceUserRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'AddWorkspaceUserRequest validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                workspaceUserData: null,
            });
        }

        const workspaceId = req.body.workspaceId;
        const userId = req.body.userId;

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                users: true
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (user === null) {
            logWithRequest('error', req, 'Could not find user with id: ' + userId);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Could not find user with id: ' + userId,
                workspaceUserData: null,
            });
        }

        if (workspace === null) {
            logWithRequest('error', req, 'Could not find workspace with id: ' + workspaceId);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Could not find workspace with id: ' + workspaceId,
                workspaceUserData: null,
            });
        }

        if (!await checkPermissions({
            user: signedInUser,
            workspaceId: req.body.workspaceId,
            capability: Capability.AddUserToWorkspace,
        })) {
            logWithRequest('error', req, 'You are not allowed to add users to this workspace.');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'You are not allowed to add users to this workspace.',
                workspaceUserData: null,
            });
        }

        // get existing workspace user
        const existingWorkspaceUser = await prisma.workspaceUser.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: userId
            }
        });

        if (existingWorkspaceUser) {
            logWithRequest('error', req, 'User is already in workspace');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'User is already in workspace',
                workspaceUserData: null,
            });
        }

        const newWorkspaceUser = await prisma.workspaceUser.create({
            data: {
                workspaceId: workspaceId,
                userId: userId,
                role: UserRole.USER
            }
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            workspaceUserData: getWorkspaceUserData(newWorkspaceUser),
        });
    } catch (ex) {
        console.error('/workspace-users/add-workspace-user caught ex', ex);
        next(ex);
        return;
    }
});

export default workspaceUsers;