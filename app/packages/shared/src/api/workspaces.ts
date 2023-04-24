import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {PermissionUser} from "../types/index.js";
import {Workspace, WorkspaceData} from "./models/Workspace.js";

export type CreateWorkspaceResponseData = BaseResponseData & {
    workspaceData: WorkspaceData | null;
}

export class CreateWorkspaceResponse extends BaseResponse {
    workspace: Workspace | null;
    constructor(data: CreateWorkspaceResponseData) {
        super(data);
        this.workspace = data.workspaceData === null ? null : new Workspace(data.workspaceData);
    }
}

export type CreateWorkspaceRequest = {
    workspaceId?: number;
    name: string;
    description: string;
    allowGuests: boolean;
    workspaceUsers: PermissionUser[]
}

export const validateCreateWorkspaceRequest = (req: CreateWorkspaceRequest) : string[] => {
    let errs : string[] = [];
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
    workspaces: Workspace[];
    constructor(data: GetWorkspacesResponseData) {
        super(data);
        this.workspaces = data.workspaceDatas?.map(wd => new Workspace(wd)) ?? [];
    }
}

export const getWorkspaces = async() : Promise<GetWorkspacesResponse> => {
    return await apiClient.get(GetWorkspacesResponse, '/workspaces/get');
}
