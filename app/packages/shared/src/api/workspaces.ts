import {apiClient} from './ApiClient';
import {BaseResponse} from "./models/BaseResponse";

export type WorkspaceCreateRequest = {
    name: string;
}

export const validateWorkspaceCreateRequest = (req: WorkspaceCreateRequest) : string[] => {
    let errs : string[] = [];
    if (req.name.length === 0) {
        errs.push('You must enter a name');
    }

    return errs;
}

export const workspaceCreate = async(params: WorkspaceCreateRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/workspaces/create', params);
}
