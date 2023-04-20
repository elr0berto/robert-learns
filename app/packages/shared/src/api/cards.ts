import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Card, CardData} from "./models/Card.js";
import {CardSet, CardSetData} from "./models/CardSet.js";
export type GetCardsForCardSetResponseData = BaseResponseData & {
    cardDatas: CardData[] | null;
}

export class GetCardsForCardSetResponse extends BaseResponse {
    cards: Card[];
    constructor(data: GetCardsForCardSetResponseData) {
        super(data);
        this.cards = data.cardDatas?.map(cd => new Card(cd)) ?? [];
    }
}
export const getCardsForCardSet = async(cardSetId : number) : Promise<GetCardsForCardSetResponse> => {
    return await apiClient.get(GetCardsForCardSetResponse, '/cards/getCardsForCardSet/'+cardSetId);
}

export type CardCreateRequest = {
    cardSetId: number,
    front: string | null;
    back: string | null;
    audio: File | null;
};

export type CardCreateResponseData = BaseResponseData & {
    cardData: CardData | null;
}

export class CardCreateResponse extends BaseResponse {
    card: Card | null;
    constructor(data: CardCreateResponseData) {
        super(data);
        this.card = data.cardData === null ? null : new Card(data.cardData);
    }
}

export const cardCreate = async(params: CardCreateRequest) : Promise<CardCreateResponse> => {
    const formData = new FormData();
    formData.append('cardSetId', params.cardSetId.toString());
    formData.append('front', params.front ?? '');
    formData.append('back', params.back ?? '');
    formData.append('audio', params.audio ?? '');
    return await apiClient.post(CardCreateResponse, '/cards/card-create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}



export type DeleteCardFromCardSetRequest = {
    cardSetId: number,
    cardId: number,
    confirm: boolean,
}

export type DeleteCardFromCardSetResponseData = BaseResponseData & {
    cardExistsInOtherCardSetDatas: CardSetData[] | null;
}

export class DeleteCardFromCardSetResponse extends BaseResponse {
    cardExistsInOtherCardSets: CardSet[];
    constructor(data: DeleteCardFromCardSetResponseData) {
        super(data);
        this.cardExistsInOtherCardSets = data.cardExistsInOtherCardSetDatas?.map(cs => new CardSet(cs)) ?? [];
    }
}

export const deleteCardFromCardSet = async(params: DeleteCardFromCardSetRequest) : Promise<DeleteCardFromCardSetResponse> => {
    return await apiClient.post(DeleteCardFromCardSetResponse, '/delete-card-from-card-set/', params);
}