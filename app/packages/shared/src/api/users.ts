import {apiClient} from "./ApiClient.js";
import {validateEmail} from "../validation/index.js";
import {BaseResponse, BaseResponseData, User, UserData} from "./models/index.js";

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
        this.user = data.userData ? new User(data.userData) : null;
    }
}

export const validateUserGetByEmailRequest = (req: UserGetByEmailRequest) : string[] => {
    const errs : string[] = [];

    if (req.email.trim().length === 0) {
        errs.push('Email is required.');
        return errs;
    }
    if (!validateEmail(req.email)) {
        errs.push('Email is invalid.')
    }

    return errs;
}

export const userGetByEmail = async(req: UserGetByEmailRequest) : Promise<UserGetByEmailResponse> => {
    const errors = validateUserGetByEmailRequest(req);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(UserGetByEmailResponse, '/users/user-get-by-email', req);
}

export type GetUsersRequest = {
    userIds: number[];
}

export type GetUsersResponseData = BaseResponseData & {
    userDatas: UserData[] | null;
}

export class GetUsersResponse extends BaseResponse {
    users: User[] | null;
    constructor(data: GetUsersResponseData) {
        super(data);
        this.users = data.userDatas?.map(u => new User(u)) ?? null;
    }
}

export const validateGetUsersRequest = (req: GetUsersRequest) : string[] => {
    const errs : string[] = [];

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
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetUsersResponse, '/users/get-users', req);
}