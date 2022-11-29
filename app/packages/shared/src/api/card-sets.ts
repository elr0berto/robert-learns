import {apiClient} from './ApiClient';
import CardSet from "./models/CardSet";
import {CardSetCardListResponse} from "./models/CardSetCardListResponse";
import {CardSetUploadFileResponse} from "./models/CardSetUploadFileResponse";

export const cardSetCardList = async(cardSet : CardSet) : Promise<CardSetCardListResponse> => {
    return await apiClient.get(CardSetCardListResponse, '/card-sets/'+cardSet.id+'/cards/');
}

export const cardSetUploadFile = async(cardSetId : number, file: File) : Promise<CardSetUploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(CardSetUploadFileResponse, '/card-sets/'+cardSetId+'/uploadFile', formData);
}