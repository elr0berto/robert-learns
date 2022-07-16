export enum Status {
    Success = "Success",
    LoggedOut = "LoggedOut",
    UserError = "UserError",
    UnexpectedError = "UnexpectedError",
}
export class BaseResponse {
    Success!: boolean;
    ErrorMessage!: string | null;

    ResponseStatus!: Status;
}