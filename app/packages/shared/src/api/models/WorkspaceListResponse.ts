import {BaseResponse, BaseResponseData} from "./BaseResponse";
import Workspace, {WorkspaceData} from "./Workspace";

export type WorkspaceListResponseData = BaseResponseData & {
    list: WorkspaceData[] | null;
}

export class WorkspaceListResponse extends BaseResponse {
    list: Workspace[] | null;
    constructor(data: WorkspaceListResponseData) {
        super(data);
        this.list = data.list?.map(wd => new Workspace(wd)) ?? null;
    }
}