import {apiClient} from "./ApiClient.js";
import {validateEmail} from "../validation/index.js";
import {BaseResponse, BaseResponseData, ResponseStatus, User, UserData} from "./models/index.js";

export type UserGetByEmailRequest = {
    email: string;
}

export type UserGetByEmailResponseData = BaseResponseData & {
    userData: UserData | null;
}

export class UserGetByEmailResponse extends BaseResponse {
    user: User | null;
    constructor(data: UserGetByEmailResponseData) {
        super(data);
        this.user = data.userData === null ? null : new User(data.userData);
    }
}

export const validateUserGetByEmailRequest = (req: UserGetByEmailRequest) : string[] => {
    let errs : string[] = [];

    if (!validateEmail(req.email)) {
        errs.push('Email is invalid.')
    }

    return errs;
}

export const userGetByEmail = async(req: UserGetByEmailRequest) : Promise<UserGetByEmailResponse> => {
    const errors = validateUserGetByEmailRequest(req);
    if (errors.length > 0) {
        return new UserGetByEmailResponse({
            dataType: true,
            userData: null,
            signedInUserData: null,
            errorMessage: errors.join('.'),
            status: ResponseStatus.UserError,
        });
    }
    return await apiClient.get(UserGetByEmailResponse, '/users/getByEmail?email='+req.email);
}
