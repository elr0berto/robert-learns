import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData, ResponseStatus} from "./models/BaseResponse.js";
import {Card, CardData} from "./models/Card.js";
import {CardSetCard, CardSetCardData} from "./models/index.js";

export type GetCardsResponseData = BaseResponseData & {
    cardDatas: CardData[] | null;
}

export class GetCardsResponse extends BaseResponse {
    cards: Card[] | null;
    constructor(data: GetCardsResponseData) {
        super(data);
        this.cards = data.cardDatas?.map(cd => new Card(cd)) ?? null;
    }
}

export type GetCardsRequest = {
    cardIds: number[],
}

export const validateGetCardsRequest = (req: GetCardsRequest) : string[] => {
    const errs : string[] = [];

    if (req.cardIds.length === 0) {
        errs.push('You must provide at least one card id');
    }

    // check that cardIds are unique
    const uniqueCardIds = new Set(req.cardIds);
    if (uniqueCardIds.size !== req.cardIds.length) {
        errs.push('You cannot request the same card twice');
    }

    return errs;
}

export const getCards = async(getCardsRequest : GetCardsRequest) : Promise<GetCardsResponse> => {
    const errors = validateGetCardsRequest(getCardsRequest);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetCardsResponse, '/cards/get-cards', getCardsRequest);
}

export type CreateCardRequest = {
    cardId: number | null;
    cardSetId: number,
    front: string | null;
    back: string | null;
    audio: File | null;
    audioUpdateStatus: 'new-card' | 'new-audio' | 'delete-audio' | 'no-change';
};

export type CreateCardResponseData = BaseResponseData & {
    cardData: CardData | null;
    cardSetCardDatas: CardSetCardData[] | null;
}

export class CreateCardResponse extends BaseResponse {
    card: Card | null;
    cardSetCards: CardSetCard[] | null;
    constructor(data: CreateCardResponseData) {
        super(data);
        this.card = data.cardData ? new Card(data.cardData) : null;
        this.cardSetCards = data.cardSetCardDatas?.map(cscd => new CardSetCard(cscd)) ?? null;
    }
}

export const validateCreateCardRequest = (params: CreateCardRequest) : string[] => {
    const errors : string[] = [];

    if (params.cardSetId <= 0) {
        errors.push('cardSetId is required');
    }
    if (params.cardId !== null && params.cardId <= 0) {
        errors.push('cardId must be null or greater than 0');
    }
    if (params.front === null) {
        errors.push('front is required');
    }
    if (params.back === null) {
        errors.push('back is required');
    }
    if (params.audioUpdateStatus === 'new-audio' && params.audio === null) {
        errors.push('audio is required');
    }
    if (params.audioUpdateStatus === 'delete-audio' && params.audio !== null) {
        errors.push('audio must be null');
    }
    // check that front and back is max 65,535 characters
    if (params.front !== null && params.front.length > 65535) {
        errors.push('front must be less than 65,535 characters');
    }
    if (params.back !== null && params.back.length > 65535) {
        errors.push('back must be less than 65,535 characters');
    }

    return errors;
}

export const createCard = async(params: CreateCardRequest) : Promise<CreateCardResponse> => {
    const errors = validateCreateCardRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }

    const formData = new FormData();
    if (params.cardId !== null) {
        formData.append('cardId', params.cardId.toString());
    }
    formData.append('cardSetId', params.cardSetId.toString());
    formData.append('front', params.front ?? '');
    formData.append('back', params.back ?? '');
    formData.append('audio', params.audio ?? '');
    formData.append('audioUpdateStatus', params.audioUpdateStatus);
    return await apiClient.post(CreateCardResponse, '/cards/create-card', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


export type DeleteCardRequest = {
    cardSetId: number,
    cardId: number,
}

export const validateDeleteCardRequest = (params: DeleteCardRequest) : string[] => {
    const errors : string[] = [];

    if (params.cardSetId <= 0) {
        errors.push('cardSetId is required');
    }
    if (params.cardId <= 0) {
        errors.push('cardId is required');
    }

    return errors;
}

export const deleteCard = async(params: DeleteCardRequest) : Promise<BaseResponse> => {
    const errors = validateDeleteCardRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(BaseResponse, '/cards/delete-card', params);
}