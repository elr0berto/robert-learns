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