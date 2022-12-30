import {apiClient} from './ApiClient.js';
import { CardCreateResponse } from './models/CardCreateResponse.js';

export type WorkspaceCardSetCreateRequest = {
    workspaceId: number;
    name: string;
}

export type CardCreateRequest = {
    cardSetId: number,
    front: string | null;
    back: string | null;
    audio: File | null;
};


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