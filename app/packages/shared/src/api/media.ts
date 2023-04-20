import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/index.js";

export type MediaUploadFileResponseData = BaseResponseData & {
    url: string;
}

export class MediaUploadFileResponse extends BaseResponse {
    url: string;
    constructor(data: MediaUploadFileResponseData) {
        super(data);
        this.url = data.url;
    }
}

export const uploadFile = async(workspaceId : number, file: File) : Promise<MediaUploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(MediaUploadFileResponse, '/media/uploadFile/'+workspaceId, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}