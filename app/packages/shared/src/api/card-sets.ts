import {apiClient} from './ApiClient.js';
import {CardSet} from "./models/index.js";
import {CardSetCardListResponse} from "./models/index.js";
import {CardSetUploadFileResponse} from "./models/index.js";

export const cardSetCardList = async(cardSet : CardSet) : Promise<CardSetCardListResponse> => {
    return await apiClient.get(CardSetCardListResponse, '/card-sets/'+cardSet.id+'/cards/');
}

export const cardSetUploadFile = async(cardSetId : number, file: File) : Promise<CardSetUploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(CardSetUploadFileResponse, '/card-sets/'+cardSetId+'/uploadFile', formData);
}