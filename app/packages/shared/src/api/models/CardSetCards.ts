import { DataType } from "./BaseResponse.js";

export type CardSetCardData = DataType & {
    cardId: number;
    cardSetId: number;
}

export class CardSetCard {
    cardId: number;
    cardSetId: number;

    constructor(data: CardSetCardData) {
        this.cardId = data.cardId;
        this.cardSetId = data.cardSetId;
    }
}