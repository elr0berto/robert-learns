import {BaseResponse, BaseResponseData, CardSetCard, CardSetCardData} from "api/models/index.js";
import {apiClient} from "api/ApiClient.js";

export type GetCardSetCardsResponseData = BaseResponseData & {
    cardSetCardDatas: CardSetCardData[] | null;
}

export class GetCardSetCardsResponse extends BaseResponse {
    cardSetCards: CardSetCard[];
    constructor(data: GetCardSetCardsResponseData) {
        super(data);
        this.cardSetCards = data.cardSetCardDatas?.map(c => new CardSetCard(c)) ?? [];
    }
}

export type GetCardSetCardsRequest = {
    cardSetIds: number[],
}

export const getCardSetCards = async(req : GetCardSetCardsRequest) : Promise<GetCardSetCardsResponse> => {
    return await apiClient.post(GetCardSetCardsResponse, '/card-set-cards/get', req);
}