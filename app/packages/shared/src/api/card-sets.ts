import {apiClient} from './ApiClient.js';
import {BaseResponse, CardSet, CardSetCardListResponse, CardSetUploadFileResponse} from "./models/index.js";
import {CardSetDeleteCardResponse} from "./models/CardSetDeleteCardResponse.js";


export const cardSetCardList = async(cardSet : CardSet) : Promise<CardSetCardListResponse> => {
    return await apiClient.get(CardSetCardListResponse, '/card-sets/'+cardSet.id+'/cards/');
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

export const cardSetDeleteCard = async(params: CardSetDeleteCardRequest) : Promise<CardSetDeleteCardResponse> => {
    return await apiClient.post(CardSetDeleteCardResponse, '/card-sets/delete-card/', params);
}