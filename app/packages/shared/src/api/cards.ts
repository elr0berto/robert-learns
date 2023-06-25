import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData, ResponseStatus} from "./models/BaseResponse.js";
import {Card, CardData} from "./models/Card.js";
import {CardSet, CardSetData} from "./models/CardSet.js";
import {CardSetCard, CardSetCardData} from "./models/index.js";

export type GetCardsResponseData = BaseResponseData & {
    cardDatas: CardData[] | null;
}

export class GetCardsResponse extends BaseResponse {
    cards: Card[];
    constructor(data: GetCardsResponseData) {
        super(data);
        this.cards = data.cardDatas?.map(cd => new Card(cd)) ?? [];
    }
}

export type GetCardsRequest = {
    cardSetIds: number[],
}

export const getCards = async(getCardsRequest : GetCardsRequest) : Promise<GetCardsResponse> => {
    return await apiClient.post(GetCardsResponse, '/cards/get', getCardsRequest);
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
        this.card = data.cardData === null ? null : new Card(data.cardData);
        this.cardSetCards = data.cardSetCardDatas?.map(cscd => new CardSetCard(cscd)) ?? null;
    }
}

export const validateCreateCardRequest = (params: CreateCardRequest) : string[] => {
    let errors : string[] = [];

    if (params.cardSetId === null) {
        errors.push('cardSetId is required');
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
        return new CreateCardResponse({
            dataType: true,
            errorMessage: errors.join(', '),
            status: ResponseStatus.UserError,
            cardData: null,
            cardSetCardDatas: null,
        });
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
    return await apiClient.post(CreateCardResponse, '/cards/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


export type DeleteCardRequest = {
    cardSetId: number,
    cardId: number,
    confirm: boolean,
}

export type DeleteCardResponseData = BaseResponseData & {
    cardExistsInOtherCardSetDatas: CardSetData[] | null;
}

export class DeleteCardResponse extends BaseResponse {
    cardExistsInOtherCardSets: CardSet[];
    constructor(data: DeleteCardResponseData) {
        super(data);
        this.cardExistsInOtherCardSets = data.cardExistsInOtherCardSetDatas?.map(cs => new CardSet(cs)) ?? [];
    }
}

export const deleteCard = async(params: DeleteCardRequest) : Promise<DeleteCardResponse> => {
    return await apiClient.post(DeleteCardResponse, '/cards/delete', params);
}