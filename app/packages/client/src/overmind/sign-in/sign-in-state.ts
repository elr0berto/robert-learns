import {derived} from 'overmind'
import User from "@elr0berto/robert-learns-shared/dist/api/models/User";
import {validateSignInRequest} from "@elr0berto/robert-learns-shared/dist/api/sign-in";

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
    submitAttempted: boolean;
    submissionError: string;
    submitting: false,
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly showErrors: boolean;
    readonly allErrors: string[];
    readonly hasErrors: boolean;
}

type SignInState = {
    status: SignInStatus,
    user: User | null;
    signInForm: SignInFormState;
    readonly isGuest: boolean;
}

export const getInitialSignInState = (user: User | null): SignInState => ({
    status: SignInStatus.Idle,
    user: user,
    signInForm: {
        username: '',
        password: '',
        submitAttempted: false,
        submissionError: '',
        submitting: false,
        submitDisabled: derived((state: SignInFormState) => {
            return state.submitting;
        }),
        validationErrors: derived((state: SignInFormState) => {
            return validateSignInRequest({
                username: state.username.trim(),
                password: state.password,
            });
        }),
        showErrors: derived((state: SignInFormState) => {
            return state.submitAttempted && state.allErrors.length > 0;
        }),
        allErrors: derived((state: SignInFormState) => {
            let errors = state.validationErrors;
            if (state.submissionError.length > 0) {
                errors.push(state.submissionError);
            }
            return errors;
        }),
        hasErrors: derived((state: SignInFormState) => {
            return state.allErrors.length > 0;
        }),
    },
    isGuest: derived((state: SignInState) => {
        return state.user?.isGuest ?? true;
    }),
});

export const state: SignInState = getInitialSignInState(null);