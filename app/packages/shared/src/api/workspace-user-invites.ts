import {apiClient} from "./ApiClient.js";
import {BaseResponse, BaseResponseData, WorkspaceUserInvite, WorkspaceUserInviteData} from "./models/index.js";
import {validateEmail} from "validation/index.js";


export type AddWorkspaceUserInviteRequest = {
    workspaceId: number;
    email: string;
}

export type AddWorkspaceUserInviteResponseData = BaseResponseData & {
    workspaceUserInviteData: WorkspaceUserInviteData | null;
}

export class AddWorkspaceUserInviteResponse extends BaseResponse {
    workspaceUserInvite: WorkspaceUserInvite | null;
    constructor(data: AddWorkspaceUserInviteResponseData) {
        super(data);
        this.workspaceUserInvite = data.workspaceUserInviteData ? new WorkspaceUserInvite(data.workspaceUserInviteData) : null;
    }
}

export const validateAddWorkspaceUserInviteRequest = (req: AddWorkspaceUserInviteRequest) : string[] => {
    const errs : string[] = [];

    if (!req.workspaceId) {
        errs.push('No workspace id provided.');
    }

    if (!req.email) {
        errs.push('No email provided.');
    }

    if (typeof req.workspaceId !== 'number') {
        errs.push('Workspace id must be a number.');
    }

    if (typeof req.email !== 'string') {
        errs.push('email must be a string.');
    }

    if (req.workspaceId < 1) {
        errs.push('Workspace id must be greater than 0.');
    }

    if (!validateEmail(req.email)) {
        errs.push('email must be valid.');
    }

    return errs;
}

export const addWorkspaceUserInvite = async(req: AddWorkspaceUserInviteRequest) : Promise<AddWorkspaceUserInviteResponse> => {
    const errors = validateAddWorkspaceUserInviteRequest(req);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(AddWorkspaceUserInviteResponse, '/workspace-user-invites/add-workspace-user-invite', req);
}