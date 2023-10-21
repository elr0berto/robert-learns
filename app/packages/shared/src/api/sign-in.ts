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
    return await apiClient.post(SignInCheckResponse, '/sign-in/check');
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
