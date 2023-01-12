import {apiClient} from './ApiClient.js';
import {BaseResponse, CardSet, CardSetCardListResponse, CardSetUploadFileResponse} from "./models/index.js";


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
    cardId: number
}

export const cardSetDeleteCard = async(params: CardSetDeleteCardRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/card-sets/delete-card/', params);
}