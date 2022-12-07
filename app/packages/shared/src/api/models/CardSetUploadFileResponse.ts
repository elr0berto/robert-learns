import {BaseResponse, BaseResponseData} from "./BaseResponse.js";

export type CardSetUploadFileResponseData = BaseResponseData & {
    url: string;
}

export class CardSetUploadFileResponse extends BaseResponse {
    url: string;
    constructor(data: CardSetUploadFileResponseData) {
        super(data);
        this.url = data.url;
    }
}