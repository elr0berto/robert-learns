import {apiClient} from './ApiClient';
import {BaseResponse} from "./models/BaseResponse";

export const LoginCheck = async () : Promise<BaseResponse> => {
    return await apiClient.get(BaseResponse, '/login/check');
};


export const LoginSubmit = async(params: {username: string, password: string}) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/login/submit', params);
}


export const Logout = async() : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/login/logout');
}