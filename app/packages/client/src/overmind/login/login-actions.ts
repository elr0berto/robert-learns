import { Context } from '..';
import {
    getInitialLoginState,
    LoginStatus,
} from "./login-state";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";
import User from "@elr0berto/robert-learns-shared/dist/api/models/User";



export const check = async ({ state, effects }: Context) => {
    state.login.status = LoginStatus.Checking;
    var result = await effects.api.login.LoginCheck();
    state.login.status = LoginStatus.Idle;
    state.login.user = result.user;
    console.log('login check user: ', result.user);
    console.log('login check user.name: ', result.user?.name() ?? 'user null');
}

export const changeLoginFormUsername = ({ state }: Context, username: string) => {
    state.login.loginForm.username = username;
};

export const changeLoginFormPassword = ({ state }: Context, password: string) => {
    state.login.loginForm.password = password;
};

export const loginSubmit = async ({ state, actions, effects }: Context) => {
    state.login.status = LoginStatus.LoggingIn;
    const results = await effects.api.login.LoginSubmit(state.login.loginForm);
    if (results.status === ResponseStatus.Success) {
        state.login.status = LoginStatus.Error;
    } else {
        state.login.user = results.user;
        state.login.status = LoginStatus.Idle;
        effects.page.router.goTo('/');
    }
};


export const logout = async ({ effects, state }: Context) => {
    state.login.status = LoginStatus.LoggingOut;
    const results = await effects.api.login.Logout();
    state.login = getInitialLoginState();
    state.login.user = results.user;
    state.login.status = LoginStatus.Idle;
    effects.page.router.goTo('/');
}

export const unexpectedlyLoggedOut = ({ effects, state }: Context, user : User) => {
    state.login = getInitialLoginState();
    state.login.status = LoginStatus.LoggedOutDueToInactivity;
    state.login.user = user;
    effects.page.router.goTo('/');
}

