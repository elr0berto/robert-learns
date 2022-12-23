import {BaseResponse, BaseResponseData} from "./BaseResponse.js";

export type CardCreateResponseData = BaseResponseData & {
    cardSetId: number | null;
}

export class CardCreateResponse extends BaseResponse {
    cardSetId: number | null;
    constructor(data: CardCreateResponseData) {
        super(data);
        this.cardSetId = data.cardSetId;
    }
}