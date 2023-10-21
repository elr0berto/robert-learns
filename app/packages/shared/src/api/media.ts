import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/index.js";

export type MediaUploadFileResponseData = BaseResponseData & {
    url: string | null;
}

export class MediaUploadFileResponse extends BaseResponse {
    url: string | null;
    constructor(data: MediaUploadFileResponseData) {
        super(data);
        this.url = data.url;
    }
}

export const uploadFile = async(workspaceId : number, file: File) : Promise<MediaUploadFileResponse> => {
    // check that file has a size above 0
    if (file.size === 0) {
        throw new Error('File is empty');
    }

    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(MediaUploadFileResponse, '/media/uploadFile/'+workspaceId, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}