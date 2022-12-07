import {BaseResponse} from "./models/BaseResponse.js";
import {apiClient} from "./ApiClient.js";

export const signOut = async() : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/sign-out');
}