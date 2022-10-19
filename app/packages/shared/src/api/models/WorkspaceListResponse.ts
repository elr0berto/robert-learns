import {BaseResponse, BaseResponseData} from "./BaseResponse";
import Workspace, {WorkspaceData} from "./Workspace";

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