import {BaseResponse, BaseResponseData} from "./BaseResponse.js";
import {Card, CardData} from "./Card.js";

export type CardCreateResponseData = BaseResponseData & {
    card: CardData | null;
}

export class CardCreateResponse extends BaseResponse {
    card: Card | null;
    constructor(data: CardCreateResponseData) {
        super(data);
        this.card = data.card === null ? null : new Card(data.card);
    }
}