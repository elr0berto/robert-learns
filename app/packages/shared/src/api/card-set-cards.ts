import {BaseResponse, BaseResponseData, CardSetCard, CardSetCardData, ResponseStatus} from "./models/index.js";
import {apiClient} from "./ApiClient.js";

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

export type CreateCardSetCardsRequest = {
    cardSetId: number;
    cardIds: number[];
}

export const validateCreateCardSetCardsRequest = (req: CreateCardSetCardsRequest) : string[] => {
    let errs : string[] = [];
    if (req.cardIds.length === 0) {
        errs.push('You must select at least one card');
    }

    // check that all card ids are unique
    const uniqueCardIds = new Set(req.cardIds);
    if (uniqueCardIds.size !== req.cardIds.length) {
        errs.push('You cannot add the same card twice');
    }

    return errs;
}

export const createCardSetCards = async(req : CreateCardSetCardsRequest) : Promise<BaseResponse> => {
    const errors = validateCreateCardSetCardsRequest(req);
    if (errors.length > 0) {
        return new BaseResponse({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            signedInUserData: null,
            errorMessage: errors.join('\n')
        });
    }

    return await apiClient.post(BaseResponse, '/card-set-cards/create', req);
}