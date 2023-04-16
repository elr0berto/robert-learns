import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Card, CardData} from "./models/Card.js";

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