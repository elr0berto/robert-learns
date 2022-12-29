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
    console.log('params.audio', params.audio);
    formData.append('cardSetId', params.cardSetId.toString());
    formData.append('front', params.front ?? '');
    formData.append('back', params.back ?? '');


    console.log('params.audio instanceof File', params.audio instanceof File); // TRUE
    //const audioName = params.audio?.name ?? undefined; // CRASH
    // @ts-ignore
    console.log('window[whatever]', window['whatever']);
    // @ts-ignore
    console.log('window[whatever][0]', window['whatever'][0]);
    // @ts-ignore
    console.log('window[whatever]', window['whatever'][0].name);

    // @ts-ignore

    //formData.append('audio', window['whatever'][0]);
    formData.append('audio', params.audio);
    return await apiClient.post(CardCreateResponse, '/cards/card-create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}