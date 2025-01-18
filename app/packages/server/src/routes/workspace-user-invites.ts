import {Request, Router} from 'express';
import {getSignedInUser, getWorkspaceUserInviteData, TypedResponse} from "../common.js";
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';

import {
    AddWorkspaceUserInviteRequest,
    AddWorkspaceUserInviteResponseData,
    validateAddWorkspaceUserInviteRequest
} from "@elr0berto/robert-learns-shared/api/workspace-user-invites";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import prisma from "../db/prisma.js";
import {logWithRequest} from "../logger.js";
import {UserRole} from "@prisma/client";

const workspaceUserInvites = Router();


workspaceUserInvites.post('/add-workspace-user-invite', async (req: Request<unknown, unknown, AddWorkspaceUserInviteRequest>, res : TypedResponse<AddWorkspaceUserInviteResponseData>, next) => {
    try {
        const signedInUser = await getSignedInUser(req.session);
        if (signedInUser === null) {
            logWithRequest('error', req, 'Guest users are not allowed to add users to workspaces.');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Guest users are not allowed to add users to workspaces.',
                workspaceUserInviteData: null,
            });
        }

        const errors = validateAddWorkspaceUserInviteRequest(req.body);

        if (errors.length !== 0) {
            logWithRequest('error', req, 'AddWorkspaceUserInviteRequest validation failed', {errors});
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: errors.join(', '),
                workspaceUserInviteData: null,
            });
        }

        const workspaceId = req.body.workspaceId;
        const email = req.body.email;

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                users: true
            }
        });

        if (workspace === null) {
            logWithRequest('error', req, 'Could not find workspace with id: ' + workspaceId);
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Could not find workspace with id: ' + workspaceId,
                workspaceUserInviteData: null,
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (user !== null) {
            logWithRequest('error', req, 'User with email already exists, cant be invited');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'User with email already exists, cant be invited',
                workspaceUserInviteData: null,
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
                workspaceUserInviteData: null,
            });
        }

        // check if invite already exists
        const invite = await prisma.workspaceUserInvite.findFirst({
            where: {
                workspaceId: workspaceId,
                email: email
            }
        });

        if (invite) {
            logWithRequest('error', req, 'Invite already exists');
            return res.json({
                dataType: true,
                status: ResponseStatus.UnexpectedError,
                errorMessage: 'Invite already exists',
                workspaceUserInviteData: null,
            });
        }

        const workspaceUserInvite = await prisma.workspaceUserInvite.create({
            data: {
                workspaceId: workspaceId,
                email: email,
                role: UserRole.USER,
            }
        });

        return res.json({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
            workspaceUserInviteData: getWorkspaceUserInviteData(workspaceUserInvite)
        });
    } catch (ex) {
        console.error('/workspace-user-invites/add-workspace-user-invite caught ex', ex);
        next(ex);
        return;
    }
});

export default workspaceUserInvites;