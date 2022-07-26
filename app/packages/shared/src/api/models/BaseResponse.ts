import User, {UserData} from "./User";
import {Type} from "class-transformer";

export enum ResponseStatus {
    Success = "Success",
    LoggedOut = "LoggedOut",
    UserError = "UserError",
    UnexpectedError = "UnexpectedError",
}

export type BaseResponseData = {
    errorMessage: string | null;
    status: ResponseStatus;
    user: UserData | null;
}

export class BaseResponse {
    errorMessage: string | null;
    status: ResponseStatus;
    user: User | null; // only set when user was logged out etc.

    constructor(data: BaseResponseData) {
        this.errorMessage = data.errorMessage;
        this.status = data.status;
        this.user = data.user === null ? null : new User(data.user);
    }
}