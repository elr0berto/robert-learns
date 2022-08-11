import { Context } from '..';
import {
    getInitialSignInState,
    SignInStatus,
} from "./sign-in-state";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";
import User from "@elr0berto/robert-learns-shared/dist/api/models/User";



export const check = async ({ state, effects }: Context) => {
    state.signIn.status = SignInStatus.Checking;
    var result = await effects.api.signIn.SignInCheck();
    state.signIn.status = SignInStatus.Idle;
    state.signIn.user = result.user;
    console.log('signIn check user: ', result.user);
    console.log('signIn check user.name: ', result.user?.name() ?? 'user null');
}

export const changeSignInFormUsername = ({ state }: Context, username: string) => {
    state.signIn.signInForm.username = username;
};

export const changeSignInFormPassword = ({ state }: Context, password: string) => {
    state.signIn.signInForm.password = password;
};

export const submit = async ({ state, actions, effects }: Context) => {
    state.signIn.status = SignInStatus.SigningIn;
    state.signIn.signInForm.submitAttempted = true;
    const results = await effects.api.signIn.SignInSubmit({
        username: state.signIn.signInForm.username,
        password: state.signIn.signInForm.password
    });
    if (results.status !== ResponseStatus.Success) {
        state.signIn.status = SignInStatus.Error;
        state.signIn.signInForm.submissionError = results.errorMessage ?? 'Unexpected error';
    } else {
        state.signIn.user = results.user;
        state.signIn.status = SignInStatus.Idle;
        effects.page.router.goTo('/');
    }
};

export const signOut = async ({ effects, state }: Context) => {
    state.signIn.status = SignInStatus.SigningOut;
    const results = await effects.api.signOut.SignOut();
    state.signIn = getInitialSignInState();
    state.signIn.user = results.user;
    state.signIn.status = SignInStatus.Idle;
    effects.page.router.goTo('/');
}

export const unexpectedlySignedOut = ({ effects, state }: Context, user : User) => {
    state.signIn = getInitialSignInState();
    state.signIn.status = SignInStatus.SignedOutDueToInactivity;
    state.signIn.user = user;
    effects.page.router.goTo('/');
}

