import {
    BaseResponse,
    BaseResponseData, Card, CardData, CardSet,
    CardSetCard,
    CardSetCardData,
    CardSetData,
    ResponseStatus
} from "./models/index.js";
import {apiClient} from "./ApiClient.js";

export type GetCardSetCardsResponseData = BaseResponseData & {
    cardSetCardDatas: CardSetCardData[] | null;
}

export class GetCardSetCardsResponse extends BaseResponse {
    cardSetCards: CardSetCard[] | null;
    constructor(data: GetCardSetCardsResponseData) {
        super(data);
        this.cardSetCards = data.cardSetCardDatas?.map(c => new CardSetCard(c)) ?? null;
    }
}

export type GetCardSetCardsRequest = {
    cardSetIds?: number[],
    cardIds?: number[],
}

export const validateGetCardSetCardsRequest = (req: GetCardSetCardsRequest) : string[] => {
    const errs : string[] = [];

    if (req.cardSetIds === undefined && req.cardIds === undefined) {
        errs.push('You must provide either cardSetIds or cardIds');
    }

    if (req.cardSetIds !== undefined && req.cardIds !== undefined) {
        errs.push('You cannot provide both cardSetIds and cardIds');
    }

    // check that cardIds are unique
    if (req.cardIds !== undefined) {
        const uniqueCardIds = new Set(req.cardIds);
        if (uniqueCardIds.size !== req.cardIds.length) {
            errs.push('You cannot request the same card twice');
        }
    }

    // check that cardSetIds are unique
    if (req.cardSetIds !== undefined) {
        const uniqueCardSetIds = new Set(req.cardSetIds);
        if (uniqueCardSetIds.size !== req.cardSetIds.length) {
            errs.push('You cannot request the same card set twice');
        }
    }

    return errs;
}
export const getCardSetCards = async(req : GetCardSetCardsRequest) : Promise<GetCardSetCardsResponse> => {
    const errors = validateGetCardSetCardsRequest(req);
    if (errors.length > 0) {
        return new GetCardSetCardsResponse({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join('\n'),
            cardSetCardDatas: [],
        });
    }
    return await apiClient.post(GetCardSetCardsResponse, '/card-set-cards/get', req);
}

export type CreateCardSetCardsRequest = {
    cardSetId: number;
    cardIds: number[];
}

export const validateCreateCardSetCardsRequest = (req: CreateCardSetCardsRequest) : string[] => {
    const errs : string[] = [];
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
            errorMessage: errors.join('\n')
        });
    }

    return await apiClient.post(BaseResponse, '/card-set-cards/create', req);
}

export type UpdateCardCardSetsResponseData = BaseResponseData & {
    cardData: CardData | null;
    cardSetCardDatas: CardSetCardData[] | null;
}

export class UpdateCardCardSetsResponse extends BaseResponse {
    card: Card | null;
    cardSetCards: CardSetCard[] | null;
    constructor(data: UpdateCardCardSetsResponseData) {
        super(data);
        this.card = data.cardData ? new Card(data.cardData) : null;
        this.cardSetCards = data.cardSetCardDatas?.map(c => new CardSetCard(c)) ?? null;
    }
}

export type UpdateCardCardSetsRequest = {
    cardId: number;
    cardSetIds: number[];
}

export const validateUpdateCardCardSetsRequest = (req: UpdateCardCardSetsRequest) : string[] => {
    const errs : string[] = [];
    if (req.cardSetIds.length === 0) {
        errs.push('You must select at least one card set');
    }

    // check that all cardSetIds are unique
    const uniqueCardSetIds = new Set(req.cardSetIds);
    if (uniqueCardSetIds.size !== req.cardSetIds.length) {
        errs.push('You cannot add the same card set twice');
    }

    return errs;
}


export const updateCardCardSets = async(req : UpdateCardCardSetsRequest) : Promise<UpdateCardCardSetsResponse> => {
    const errors = validateUpdateCardCardSetsRequest(req);
    if (errors.length > 0) {
        return new UpdateCardCardSetsResponse({
            dataType: true,
            status: ResponseStatus.UnexpectedError,
            errorMessage: errors.join('\n'),
            cardData: null,
            cardSetCardDatas: null,
        });
    }
    return await apiClient.post(UpdateCardCardSetsResponse, '/card-set-cards/updateCardCardSets', req);
}