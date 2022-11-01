import {BaseResponse, BaseResponseData} from "./BaseResponse";

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