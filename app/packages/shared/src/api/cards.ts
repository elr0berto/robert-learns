import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Card, CardData} from "./models/Card.js";
import {CardSet, CardSetData} from "./models/CardSet.js";
import {CreateCardSetRequest} from "api/card-sets.js";

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
    cardSetId: number,
    front: string | null;
    back: string | null;
    audio: File | null;
};

export type CreateCardResponseData = BaseResponseData & {
    cardData: CardData | null;
}

export class CreateCardResponse extends BaseResponse {
    card: Card | null;
    constructor(data: CreateCardResponseData) {
        super(data);
        this.card = data.cardData === null ? null : new Card(data.cardData);
    }
}

export const createCard = async(params: CreateCardRequest) : Promise<CreateCardResponse> => {
    const formData = new FormData();
    formData.append('cardSetId', params.cardSetId.toString());
    formData.append('front', params.front ?? '');
    formData.append('back', params.back ?? '');
    formData.append('audio', params.audio ?? '');
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