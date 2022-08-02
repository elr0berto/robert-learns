import {BaseResponse} from "./models/BaseResponse";
import {apiClient} from "./ApiClient";

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
        errs.push('First name must be at least 3 characters');
    }
    if (req.lastName.length < 3) {
        errs.push('Last name must be at least 3 characters');
    }
    if (req.username.length < 3) {
        errs.push('Username must be at least 3 characters');
    }
    if (req.username.length < 3) {
        errs.push('Username must be at least 3 characters');
    }

    return errs;
}

export const SignUpSubmit = async(params: SignUpSubmitRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/signUp/submit', params);
}
