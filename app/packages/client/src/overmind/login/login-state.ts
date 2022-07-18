import {derived} from 'overmind'
import User from "@elr0berto/robert-learns-shared/src/api/models/User";

export const UnexpectedLogoutError = "UNEXPECTED_LOGOUT_ERROR";

export enum LoginStatus {
    Checking = "Checking",
    LoggingIn = "LoggingIn",
    LoggingOut = "LoggingOut",
    LoggedOutDueToInactivity = "LoggedOutDueToInactivity",
    Idle = "Idle",
    Error = "Error",
}

type LoginFormState = {
    username: string;
    password: string;
}
type LoginState = {
    status: LoginStatus,
    user: User | null;
    loginForm: LoginFormState;
    readonly isGuest: boolean;
}

export const getInitialLoginState = (): LoginState => ({
    status: LoginStatus.Checking,
    user: null,
    loginForm: {
        username: '',
        password: '',
    },
    isGuest: derived((state: LoginState) => {
        return state.user?.isGuest ?? true;
    }),
})
export const state: LoginState = getInitialLoginState();
