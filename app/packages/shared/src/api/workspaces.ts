import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {PermissionUser, UserRole} from "../types/index.js";
import {CardSet, CardSetData} from "./models/CardSet.js";
import {Workspace, WorkspaceData} from "./models/Workspace.js";

export type WorkspaceCreateResponseData = BaseResponseData & {
    workspaceData: WorkspaceData | null;
}

export class WorkspaceCreateResponse extends BaseResponse {
    workspace: Workspace | null;
    constructor(data: WorkspaceCreateResponseData) {
        super(data);
        this.workspace = data.workspaceData === null ? null : new Workspace(data.workspaceData);
    }
}

export type WorkspaceCreateRequest = {
    workspaceId?: number;
    name: string;
    description: string;
    allowGuests: boolean;
    workspaceUsers: PermissionUser[]
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

export const workspaceCreate = async(params: WorkspaceCreateRequest) : Promise<WorkspaceCreateResponse> => {
    return await apiClient.post(WorkspaceCreateResponse, '/workspaces/create', params);
}

export type WorkspaceEditResponseData = BaseResponseData & {
    workspaceData: WorkspaceData | null;
}

export class WorkspaceEditResponse extends BaseResponse {
    workspace: Workspace | null;
    constructor(data: WorkspaceEditResponseData) {
        super(data);
        this.workspace = data.workspaceData === null ? null : new Workspace(data.workspaceData);
    }
}

export type WorkspaceEditRequest = {
    name: string;
    description: string;
    allowGuests: boolean;
    workspaceUsers: PermissionUser[]
}

export const validateWorkspaceEditRequest = (req: WorkspaceEditRequest) : string[] => {
    let errs : string[] = [];
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }

    return errs;
}

export const workspaceEdit = async(params: WorkspaceEditRequest) : Promise<WorkspaceEditResponse> => {
    return await apiClient.post(WorkspaceEditResponse, '/workspaces/edit', params);
}

export type WorkspaceListResponseData = BaseResponseData & {
    workspaces: WorkspaceData[] | null;
}

export class WorkspaceListResponse extends BaseResponse {
    workspaces: Workspace[];
    constructor(data: WorkspaceListResponseData) {
        super(data);
        this.workspaces = data.workspaces?.map(wd => new Workspace(wd)) ?? [];
    }
}

export const workspaceList = async() : Promise<WorkspaceListResponse> => {
    return await apiClient.get(WorkspaceListResponse, '/workspaces');
}

export type WorkspaceCardSetListResponseData = BaseResponseData & {
    cardSets: CardSetData[] | null;
}

export class WorkspaceCardSetListResponse extends BaseResponse {
    cardSets: CardSet[];
    constructor(data: WorkspaceCardSetListResponseData) {
        super(data);
        this.cardSets = data.cardSets?.map(csd => new CardSet(csd)) ?? [];
    }
}

export const workspaceCardSetList = async(workspace : Workspace) : Promise<WorkspaceCardSetListResponse> => {
    console.log('workspaceCardSetList ', '/workspace/'+workspace.id+'/card-sets/');
    return await apiClient.get(WorkspaceCardSetListResponse, '/workspaces/'+workspace.id+'/card-sets/');
}

export type WorkspaceCardSetCreateResponseData = BaseResponseData & {
    cardSetId: number | null;
}

export class WorkspaceCardSetCreateResponse extends BaseResponse {
    cardSetId: number | null;
    constructor(data: WorkspaceCardSetCreateResponseData) {
        super(data);
        this.cardSetId = data.cardSetId;
    }
}

export type WorkspaceCardSetCreateRequest = {
    workspaceId: number;
    name: string;
    description: string;
}

export const validateWorkspaceCardSetCreateRequest = (req: WorkspaceCardSetCreateRequest) : string[] => {
    let errs : string[] = [];
    if (req.workspaceId <= 0) {
        errs.push('Workspace id is missing');
    }
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }

    return errs;
}


export const workspaceCardSetCreate = async(params: WorkspaceCardSetCreateRequest) : Promise<WorkspaceCardSetCreateResponse> => {
    return await apiClient.post(WorkspaceCardSetCreateResponse, '/workspaces/card-set-create', params);
}