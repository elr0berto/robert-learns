import {BaseResponse, BaseResponseData} from "./BaseResponse.js";
import {CardSet, CardSetData} from "./CardSet.js";

export type CardSetDeleteCardResponseData = BaseResponseData & {
    cardExistsInOtherCardSets: CardSetData[] | null;
}

export class CardSetDeleteCardResponse extends BaseResponse {
    cardExistsInOtherCardSets: CardSet[];
    constructor(data: CardSetDeleteCardResponseData) {
        super(data);
        this.cardExistsInOtherCardSets = data.cardExistsInOtherCardSets?.map(cs => new CardSet(cs)) ?? [];
    }
}