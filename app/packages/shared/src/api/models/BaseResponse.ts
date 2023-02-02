import {User,UserData} from "./User.js";
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
    signedInUser: UserData | null;
}

export class BaseResponse {
    errorMessage: string | null;
    status: ResponseStatus;
    signedInUser: User | null; // only set when user was logged out etc.

    constructor(data: BaseResponseData) {
        this.errorMessage = data.errorMessage;
        this.status = data.status;
        this.signedInUser = data.signedInUser === null ? null : new User(data.signedInUser);
    }
}