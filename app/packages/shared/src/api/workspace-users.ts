import {apiClient} from "./ApiClient.js";
import {BaseResponse, BaseResponseData, WorkspaceUser, WorkspaceUserData} from "./models/index.js";


export type GetWorkspaceUsersRequest = {
    workspaceIds: number[];
}

export type GetWorkspaceUsersResponseData = BaseResponseData & {
    workspaceUserDatas: WorkspaceUserData[] | null;
}

export class GetWorkspaceUsersResponse extends BaseResponse {
    workspaceUsers: WorkspaceUser[] | null;
    constructor(data: GetWorkspaceUsersResponseData) {
        super(data);
        this.workspaceUsers = data.workspaceUserDatas?.map(wu => new WorkspaceUser(wu)) ?? null;
    }
}

export const validateGetWorkspaceUsersRequest = (req: GetWorkspaceUsersRequest) : string[] => {
    const errs : string[] = [];

    if (req.workspaceIds.length === 0) {
        errs.push('No workspace ids provided.');
    }

    // check that userIds are unique
    const uniqueIds = new Set(req.workspaceIds);
    if (uniqueIds.size !== req.workspaceIds.length) {
        errs.push('workspace ids must be unique.');
    }

    return errs;
}

export const getWorkspaceUsers = async(req: GetWorkspaceUsersRequest) : Promise<GetWorkspaceUsersResponse> => {
    const errors = validateGetWorkspaceUsersRequest(req);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetWorkspaceUsersResponse, '/workspace-users/get-workspace-users', req);
}

export type AddWorkspaceUserRequest = {
    workspaceId: number;
    userId: number;
}

export type AddWorkspaceUserResponseData = BaseResponseData & {
    workspaceUserData: WorkspaceUserData | null;
}

export class AddWorkspaceUserResponse extends BaseResponse {
    workspaceUser: WorkspaceUser | null;
    constructor(data: AddWorkspaceUserResponseData) {
        super(data);
        this.workspaceUser = data.workspaceUserData ? new WorkspaceUser(data.workspaceUserData) : null;
    }
}

export const validateAddWorkspaceUserRequest = (req: AddWorkspaceUserRequest) : string[] => {
    const errs : string[] = [];

    if (!req.workspaceId) {
        errs.push('No workspace id provided.');
    }

    if (!req.userId) {
        errs.push('No user id provided.');
    }

    if (typeof req.workspaceId !== 'number') {
        errs.push('Workspace id must be a number.');
    }

    if (typeof req.userId !== 'number') {
        errs.push('User id must be a number.');
    }

    if (req.workspaceId < 1) {
        errs.push('Workspace id must be greater than 0.');
    }

    if (req.userId < 1) {
        errs.push('User id must be greater than 0.');
    }

    return errs;
}
export const addWorkspaceUser = async(req: AddWorkspaceUserRequest) : Promise<AddWorkspaceUserResponse> => {
    const errors = validateAddWorkspaceUserRequest(req);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(AddWorkspaceUserResponse, '/workspace-users/add-workspace-user', req);
}