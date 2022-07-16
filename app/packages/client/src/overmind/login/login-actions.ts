import { Context } from '..';
import {
    getInitialLoginState,
    LoginPageStatus,
} from "./login-state";



export const changeLoginFormUsername = ({ state }: Context, username: string) => {
    state.login.loginForm.username = username;
};

export const changeLoginFormPassword = ({ state }: Context, password: string) => {
    state.login.loginForm.password = password;
};

export const loginSubmit = async ({ state, actions, effects }: Context) => {
    state.login.status = LoginPageStatus.LoggingIn;
    const results = await effects.api.login.Login(state.login.loginForm);
};


export const logout = async ({ effects, state }: Context) => {
    state.login.status = LoginPageStatus.LoggingOut;
    await effects.api.login.Logout()
    state.login = getInitialLoginState();
    effects.page.router.goTo('/');
}

export const unexpectedlyLoggedOut = ({ effects, state }: Context) => {
    state.login = getInitialLoginState();
    state.login.status = LoginPageStatus.LoggedOutDueToInactivity;
    effects.page.router.goTo('/');
}

