import {Request, Router} from 'express';
import {getSignedInUser, getWorkspaceData, getWorkspaceUserData, TypedResponse} from "../common.js";
import {ResponseStatus} from '@elr0berto/robert-learns-shared/api/models';

import {
    GetWorkspaceUsersRequest,
    GetWorkspaceUsersResponseData,
    validateGetWorkspaceUsersRequest
} from "@elr0berto/robert-learns-shared/api/workspace-users";
import {checkPermissions} from "../permissions.js";
import {Capability} from "@elr0berto/robert-learns-shared/permissions";
import prisma from "../db/prisma.js";

const workspaceUsers = Router();

workspaceUsers.post('/get-workspace-users', async (req: Request<{}, {}, GetWorkspaceUsersRequest>, res : TypedResponse<GetWorkspaceUsersResponseData>) => {
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
        if (!await checkPermissions({user: signedInUser, workspaceId: workspaceIds[i], capability: Capability.ViewWorkspace})) {
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
        workspaceUserDatas: workspaceUsers.map(wu => getWorkspaceUserData(wu)),
    });
});


export default workspaceUsers;