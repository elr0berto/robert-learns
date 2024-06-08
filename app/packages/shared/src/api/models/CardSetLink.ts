import { DataType } from "./BaseResponse.js";

export type CardSetLinkData = DataType & {
    parentCardSetId: number;
    includedCardSetId: number;
}

export class CardSetLink {
    parentCardSetId: number;
    includedCardSetId: number;

    constructor(data: CardSetLinkData) {
        this.parentCardSetId = data.parentCardSetId;
        this.includedCardSetId = data.includedCardSetId;
    }
}