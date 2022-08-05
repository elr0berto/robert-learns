import {apiClient} from './ApiClient';
import {BaseResponse} from "./models/BaseResponse";

export const SignInCheck = async () : Promise<BaseResponse> => {
    return await apiClient.get(BaseResponse, '/sign-in/check');
};


export const SignInSubmit = async(params: {username: string, password: string}) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/sign-in/submit', params);
}


export const SignOut = async() : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/sign-in/sign-out');
}