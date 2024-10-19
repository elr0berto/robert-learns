import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {User, UserData} from "./models/index.js";

export type SignInCheckResponseData = BaseResponseData & {
    userData: UserData | null;
}

export class SignInCheckResponse extends BaseResponse {
    user: User | null;
    constructor(data: SignInCheckResponseData) {
        super(data);
        this.user = data.userData ? new User(data.userData) : null;
    }
}


export const SignInCheck = async () : Promise<SignInCheckResponse> => {
    return await apiClient.post(SignInCheckResponse, '/sign-in/sign-in-check');
};

export type SignInRequest = {
    username: string;
    password: string;
}

export const validateSignInRequest = (req: SignInRequest) : string[] => {
    const errs : string[] = [];
    if (req.username.length === 0) {
        errs.push('You must enter a username');
    }
    if (req.password.length === 0) {
        errs.push('You must enter a password');
    }

    return errs;
}

export type SignInResponseData = BaseResponseData & {
    userData: UserData | null;
}

export class SignInResponse extends BaseResponse {
    user: User | null;
    constructor(data: SignInResponseData) {
        super(data);
        this.user = data.userData ? new User(data.userData) : null;
    }
}



export const signIn = async(params: SignInRequest) : Promise<SignInResponse> => {
    const errors = validateSignInRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(SignInResponse, '/sign-in', params);
}

export type SignInGoogleRequest = {
    id_token: string; // the name is important "id_token", its used by the GoogleTokenStrategy.
}

export const validateSignInGoogleRequest = (req: SignInGoogleRequest) : string[] => {
    const errs : string[] = [];
    if (typeof req.id_token !== 'string' || req.id_token.length === 0) {
        errs.push('You must provide a token');
    }

    return errs;
}

export const signInGoogle = async(params: SignInGoogleRequest) : Promise<BaseResponse> => {
    const errors = validateSignInGoogleRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(BaseResponse, '/sign-in/google', params);
}


export type SignInFacebookRequest = {
    access_token: string; // the name is important "access_token", its used by the FacebookTokenStrategy.
}

export const validateSignInFacebookRequest = (req: SignInFacebookRequest) : string[] => {
    const errs : string[] = [];
    if (typeof req.access_token !== 'string' || req.access_token.length === 0) {
        errs.push('You must provide a access_token');
    }

    return errs;
}

export const signInFacebook = async(params: SignInFacebookRequest) : Promise<BaseResponse> => {
    const errors = validateSignInFacebookRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(BaseResponse, '/sign-in/facebook', params);
}