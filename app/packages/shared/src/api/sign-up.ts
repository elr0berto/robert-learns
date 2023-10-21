import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {apiClient} from "./ApiClient.js";
import {validateEmail} from "../validation/index.js";
import {User, UserData} from "./models/index.js";

export type SignUpRequest = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
}

export const validateSignUpRequest = (req: SignUpRequest) : string[] => {
    const errs : string[] = [];
    if (req.firstName.length < 3) {
        errs.push('First name must be at least 3 characters.');
    }
    if (req.lastName.length < 3) {
        errs.push('Last name must be at least 3 characters.');
    }
    if (req.username.length < 3) {
        errs.push('Username must be at least 3 characters.');
    }
    if (req.password.length < 6) {
        errs.push('Password must be at least 6 characters.');
    }
    if (!validateEmail(req.email)) {
        errs.push('Email is invalid.')
    }

    return errs;
}

export type SignUpResponseData = BaseResponseData & {
    userData: UserData | null;
}

export class SignUpResponse extends BaseResponse {
    user: User | null;
    constructor(data: SignUpResponseData) {
        super(data);
        this.user = data.userData ? new User(data.userData) : null;
    }
}

export const signUp = async(params: SignUpRequest) : Promise<SignUpResponse> => {
    const errors = validateSignUpRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(SignUpResponse, '/sign-up', params);
}
