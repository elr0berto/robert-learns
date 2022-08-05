import {BaseResponse} from "./models/BaseResponse";
import {apiClient} from "./ApiClient";
import {validateEmail} from "../validation";

type SignUpSubmitRequest = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
}

export const ValidateSignUpRequest = (req: SignUpSubmitRequest) : string[] => {
    let errs : string[] = [];
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

export const SignUpSubmit = async(params: SignUpSubmitRequest) : Promise<BaseResponse> => {
    console.log('SignUpSubmit');
    return await apiClient.post(BaseResponse, '/sign-up/submit', params);
}
