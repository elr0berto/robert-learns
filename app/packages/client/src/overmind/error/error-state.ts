import {ErrorInfo} from "react";

export type ErrorState = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    reloadingPage: boolean;
}

export const state: ErrorState = {
    error: null,
    errorInfo: null,
    reloadingPage: false,
}

