import {ErrorInfo} from "react";
import {overmind} from "../..";

export enum ErrorLevel {
    Info = "Info",
    Warn = "Warn",
    Error = "Error",
    Debug = "Debug",
}

interface BaseLogParams {
    message?: string;
    errorCode?: string;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface LogParams extends BaseLogParams {
    level: ErrorLevel;
}

export const log = async ({level, message, errorCode, error, errorInfo}: LogParams) => {
    console.log(level + (message ? ": " + message : ''), error);
    //await overmind.effects.api.log.Log({level,message,errorCode, error, errorInfo});
}

export const logError = async(params: BaseLogParams) => {
    await log({level: ErrorLevel.Error, ...params});
}

export const logWarn = async(params: BaseLogParams) => {
    await log({level: ErrorLevel.Warn, ...params});
}

export const logInfo = async(params: BaseLogParams) => {
    await log({level: ErrorLevel.Info, ...params});
}

export const logDebug = async(params: BaseLogParams) => {
    await log({level: ErrorLevel.Debug, ...params});
}