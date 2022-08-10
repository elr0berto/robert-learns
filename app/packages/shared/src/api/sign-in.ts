import {apiClient} from './ApiClient';
import {BaseResponse} from "./models/BaseResponse";
import {validateEmail} from "../validation";

export const SignInCheck = async () : Promise<BaseResponse> => {
    return await apiClient.get(BaseResponse, '/sign-in/check');
};


export type SignInSubmitRequest = {
    username: string;
    password: string;
}

export const ValidateSignInSubmitRequest = (req: SignInSubmitRequest) : string[] => {
    let errs : string[] = [];
    if (req.username.length === 0) {
        errs.push('You must enter a username');
    }
    if (req.password.length === 0) {
        errs.push('You must enter a password');
    }

    return errs;
}

export const SignInSubmit = async(params: SignInSubmitRequest) : Promise<BaseResponse> => {
    console.log('SignInSubmit');
    return await apiClient.post(BaseResponse, '/sign-in/submit', params);
}
