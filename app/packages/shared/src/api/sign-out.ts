import {BaseResponse} from "./models/BaseResponse";
import {apiClient} from "./ApiClient";

export const SignOut = async() : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/sign-out');
}