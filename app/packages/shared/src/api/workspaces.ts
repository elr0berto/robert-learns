import {apiClient} from './ApiClient';
import {BaseResponse} from "./models/BaseResponse";
import {WorkspaceListResponse} from "./models/WorkspaceListResponse";
import Workspace from "./models/Workspace";
import {WorkspaceCardSetListResponse} from "./models/WorkspaceCardSetListResponse";

export type WorkspaceCreateRequest = {
    name: string;
    description: string;
}

export const validateWorkspaceCreateRequest = (req: WorkspaceCreateRequest) : string[] => {
    let errs : string[] = [];
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }

    return errs;
}

export const workspaceCreate = async(params: WorkspaceCreateRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/workspaces/create', params);
}

export const workspaceList = async() : Promise<WorkspaceListResponse> => {
    return await apiClient.get(WorkspaceListResponse, '/workspaces');
}

export const workspaceCardSetList = async(workspace : Workspace) : Promise<WorkspaceCardSetListResponse> => {
    return await apiClient.get(WorkspaceCardSetListResponse, '/workspace/'+workspace.id+'/card-sets/');
}