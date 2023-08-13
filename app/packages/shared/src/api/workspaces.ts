import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Workspace, WorkspaceData} from "./models/Workspace.js";
import {UserRole} from "./models/UserRole.js";

export type CreateWorkspaceResponseData = BaseResponseData & {
    workspaceData: WorkspaceData | null;
}

export class CreateWorkspaceResponse extends BaseResponse {
    workspace: Workspace | null;
    constructor(data: CreateWorkspaceResponseData) {
        super(data);
        this.workspace = data.workspaceData ? new Workspace(data.workspaceData) : null;
    }
}

interface CreateWorkspaceUser {
    userId: number;
    role: UserRole;
}

export type CreateWorkspaceRequest = {
    workspaceId?: number;
    name: string;
    description: string;
    allowGuests: boolean;
    workspaceUsers: CreateWorkspaceUser[];
}

export const validateCreateWorkspaceRequest = (req: CreateWorkspaceRequest) : string[] => {
    const errs : string[] = [];
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }

    return errs;
}

export const createWorkspace = async(params: CreateWorkspaceRequest) : Promise<CreateWorkspaceResponse> => {
    return await apiClient.post(CreateWorkspaceResponse, '/workspaces/create', params);
}

export type GetWorkspacesResponseData = BaseResponseData & {
    workspaceDatas: WorkspaceData[] | null;
}

export class GetWorkspacesResponse extends BaseResponse {
    workspaces: Workspace[] | null;
    constructor(data: GetWorkspacesResponseData) {
        super(data);
        this.workspaces = data.workspaceDatas?.map(wd => new Workspace(wd)) ?? null;
    }
}

export const getWorkspaces = async() : Promise<GetWorkspacesResponse> => {
    return await apiClient.post(GetWorkspacesResponse, '/workspaces/get');
}

export type DeleteWorkspaceRequest = {
    workspaceId: number;
}

export const deleteWorkspace = async(params: DeleteWorkspaceRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/workspaces/delete-workspace', params);
}