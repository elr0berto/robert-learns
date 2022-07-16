import {derived} from 'overmind'
import User from "@elr0berto/robert-learns-shared/src/models/User";

export const UnexpectedLogoutError = "UNEXPECTED_LOGOUT_ERROR";

export enum LoginPageStatus {
    Default = "Default",
    Checking = "Checking",
    LoggingIn = "LoggingIn",
    LoggingOut = "LoggingOut",
    LoggedOutDueToInactivity = "LoggedOutDueToInactivity",
    Error = "Error",
}

type LoginFormState = {
    username: string;
    password: string;
}
type LoginState = {
    status: LoginPageStatus,
    user: User | null;
    loginForm: LoginFormState;
    readonly loggedIn: boolean;
}

export const getInitialLoginState = (): LoginState => ({
    status: LoginPageStatus.Default,
    user: null,
    loginForm: {
        username: '',
        password: '',
    },
    loggedIn: derived((state: LoginState) => {
        return state.user !== null;
    }),
})
export const state: LoginState = getInitialLoginState();
