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
            errorMessage: errors.join('.'),
            status: ResponseStatus.UserError,
        });
    }
    return await apiClient.post(UserGetByEmailResponse, '/users/getByEmail', req);
}

export type GetUsersRequest = {
    userIds: number[];
}

export type GetUsersResponseData = BaseResponseData & {
    userDatas: UserData[];
}

export class GetUsersResponse extends BaseResponse {
    users: User[];
    constructor(data: GetUsersResponseData) {
        super(data);
        this.users = data.userDatas.map(u => new User(u));
    }
}

export const validateGetUsersRequest = (req: GetUsersRequest) : string[] => {
    let errs : string[] = [];

    if (req.userIds.length === 0) {
        errs.push('No user ids provided.');
    }

    // check that userIds are unique
    const uniqueUserIds = new Set(req.userIds);
    if (uniqueUserIds.size !== req.userIds.length) {
        errs.push('User ids must be unique.');
    }

    return errs;
}

export const getUsers = async(req: GetUsersRequest) : Promise<GetUsersResponse> => {
    const errors = validateGetUsersRequest(req);
    if (errors.length > 0) {
        return new GetUsersResponse({
            dataType: true,
            userDatas: [],
            errorMessage: errors.join('.'),
            status: ResponseStatus.UserError,
        });
    }
    return await apiClient.post(GetUsersResponse, '/users/getUsers', req);
}