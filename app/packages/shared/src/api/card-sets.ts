import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData, CardSet, CardSetData} from "./models/index.js";
import { Card, CardData} from "./models/Card.js";



export type CardSetCardListResponseData = BaseResponseData & {
    cards: CardData[] | null;
}

export class CardSetCardListResponse extends BaseResponse {
    cards: Card[];
    constructor(data: CardSetCardListResponseData) {
        super(data);
        this.cards = data.cards?.map(cd => new Card(cd)) ?? [];
    }
}

export const cardSetCardList = async(cardSet : CardSet) : Promise<CardSetCardListResponse> => {
    return await apiClient.get(CardSetCardListResponse, '/card-sets/'+cardSet.id+'/cards/');
}

export type CardSetUploadFileResponseData = BaseResponseData & {
    url: string;
}

export class CardSetUploadFileResponse extends BaseResponse {
    url: string;
    constructor(data: CardSetUploadFileResponseData) {
        super(data);
        this.url = data.url;
    }
}

export const cardSetUploadFile = async(cardSetId : number, file: File) : Promise<CardSetUploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(CardSetUploadFileResponse, '/card-sets/'+cardSetId+'/uploadFile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export type CardSetDeleteCardRequest = {
    cardSetId: number,
    cardId: number,
    confirm: boolean,
}

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


export const cardSetDeleteCard = async(params: CardSetDeleteCardRequest) : Promise<CardSetDeleteCardResponse> => {
    return await apiClient.post(CardSetDeleteCardResponse, '/card-sets/delete-card/', params);
}