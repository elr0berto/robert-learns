import {apiClient} from './ApiClient';
import {BaseResponse} from "./models/BaseResponse";
import {validateEmail} from "../validation";

export const SignInCheck = async () : Promise<BaseResponse> => {
    return await apiClient.get(BaseResponse, '/sign-in/check');
};


export type SignInRequest = {
    username: string;
    password: string;
}

export const validateSignInRequest = (req: SignInRequest) : string[] => {
    let errs : string[] = [];
    if (req.username.length === 0) {
        errs.push('You must enter a username');
    }
    if (req.password.length === 0) {
        errs.push('You must enter a password');
    }

    return errs;
}

export const signIn = async(params: SignInRequest) : Promise<BaseResponse> => {
    console.log('SignInSubmit');
    return await apiClient.post(BaseResponse, '/sign-in', params);
}
