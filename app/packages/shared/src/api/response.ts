import User from "./models/User";

export enum ResponseStatus {
    Success = "Success",
    LoggedOut = "LoggedOut",
    UserError = "UserError",
    UnexpectedError = "UnexpectedError",
}
export class BaseResponse {
    ErrorMessage!: string | null;
    Status!: ResponseStatus;
    User!: User | null; // only set when user was logged out etc.
}