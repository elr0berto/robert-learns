import { DataType } from "./BaseResponse.js";

export type CardSetCardData = DataType & {
    cardId: number;
    cardSetId: number;
    order: number;
}

export class CardSetCard {
    cardId: number;
    cardSetId: number;
    order: number;

    constructor(data: CardSetCardData) {
        this.cardId = data.cardId;
        this.cardSetId = data.cardSetId;
        this.order = data.order;
    }
}