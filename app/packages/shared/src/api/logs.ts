import {BaseResponse, BaseResponseData, LogEntry, LogEntryData, ResponseStatus} from "./models/index.js";
import {apiClient} from "./ApiClient.js";
import { serializeError } from "serialize-error";

export type GetLogEntriesResponseData = BaseResponseData & {
    logEntryDatas: LogEntryData[] | null;
}

export class GetLogEntriesResponse extends BaseResponse {
    logEntries: LogEntry[] | null;
    constructor(data: GetLogEntriesResponseData ) {
        super(data);
        this.logEntries = data.logEntryDatas?.map((logEntryData) => new LogEntry(logEntryData)) ?? null;
    }
}

export type GetLogEntriesRequest = {
    fromId: number | null,
}

export const getLogEntries = async(req: GetLogEntriesRequest) : Promise<GetLogEntriesResponse> => {
    return await apiClient.post(GetLogEntriesResponse, '/logs/get-log-entries', req);
}


export enum ErrorLevel {
    Info = "Info",
    Warn = "Warn",
    Error = "Error",
    Debug = "Debug",
}



export type AddLogEntryRequestParams = {
    level: ErrorLevel;
    message?: string;
    errorCode?: string;
    error?: Error;
    componentStack?: string;
}

export type AddLogEntryRequest = {
    level: ErrorLevel;
    message?: string;
    errorCode?: string;
    error?: string;
    componentStack?: string;
}


let logAttempts = 0;


export const addLogEntry = async (req: AddLogEntryRequestParams) : Promise<BaseResponse> => {
    if (logAttempts >= 3) {
        return new BaseResponse({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
        });
    }
    logAttempts++;

    if (!req.message && !req.error && !req.componentStack) {
        return new BaseResponse({
            dataType: true,
            status: ResponseStatus.Success,
            errorMessage: null,
        });
    }

    let errorObject = null;
    if (req.error) {
        const serializedError = serializeError(req.error);
        errorObject = {
            Name: serializedError.name,
            Code: serializedError.code,
            Stack: serializedError.stack,
            Message: serializedError.message
        };

        // ignore tiktok pixel illegal invocation
        if (typeof errorObject.Stack === 'string' && errorObject.Stack.match(/Illegal invocation/i) && errorObject.Stack.match(/tiktok/i)) {
            return new BaseResponse({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
            });
        }

        if ((req.message ?? null) === null && errorObject.Code === null && typeof errorObject.Stack === 'string' && !errorObject.Stack.match(/^Error:/i)) {
            return new BaseResponse({
                dataType: true,
                status: ResponseStatus.Success,
                errorMessage: null,
            });
        }
    }

    // Error object serialized to string
    const realReq = {
        level: req.level,
        message: req.message,
        errorCode: req.errorCode,
        error: errorObject,
        componentStack: req.componentStack,
    }
    return await apiClient.post(BaseResponse, '/logs/add-log-entry', realReq);
};