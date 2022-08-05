import {derived} from 'overmind'
import User from "@elr0berto/robert-learns-shared/dist/api/models/User";

export const UnexpectedSignOutError = "UNEXPECTED_SIGN_OUT_ERROR";

export enum SignInStatus {
    Checking = "Checking",
    SigningIn = "SigningIn",
    SigningOut = "SigningOut",
    SignedOutDueToInactivity = "SignedOutDueToInactivity",
    Idle = "Idle",
    Error = "Error",
}

type SignInFormState = {
    username: string;
    password: string;
}
type SignInState = {
    status: SignInStatus,
    user: User | null;
    signInForm: SignInFormState;
    readonly isGuest: boolean;
}

export const getInitialSignInState = (): SignInState => ({
    status: SignInStatus.Checking,
    user: null,
    signInForm: {
        username: '',
        password: '',
    },
    isGuest: derived((state: SignInState) => {
        return state.user?.isGuest ?? true;
    }),
})
export const state: SignInState = getInitialSignInState();
