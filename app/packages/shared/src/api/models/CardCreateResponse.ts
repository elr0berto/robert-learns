import {BaseResponse, BaseResponseData} from "./BaseResponse.js";

export type CardCreateResponseData = BaseResponseData & {
}

export class CardCreateResponse extends BaseResponse {
    constructor(data: CardCreateResponseData) {
        super(data);
    }
}