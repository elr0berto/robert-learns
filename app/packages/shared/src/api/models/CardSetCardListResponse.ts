import {BaseResponse, BaseResponseData} from "./BaseResponse";
import Card, {CardData} from "./Card";

export type CardSetCardListResponseData = BaseResponseData & {
    cards: CardData[] | null;
}

export class CardSetCardListResponse extends BaseResponse {
    cards: Card[];
    constructor(data: CardSetCardListResponseData) {
        super(data);
        this.cards = data.cards?.map(cd => new Card(cd)) ?? [];
    }
}