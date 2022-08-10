import {derived} from 'overmind'
import User from "@elr0berto/robert-learns-shared/dist/api/models/User";
import {ValidateSignInSubmitRequest} from "@elr0berto/robert-learns-shared/dist/api/sign-in";

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
    readonly validationErrors: string[];
    readonly showErrors: boolean;
    readonly allErrors: string[];
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
        submitAttempted: false,
        validationErrors: derived((state: SignInFormState) => {
            return ValidateSignInSubmitRequest({
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
    },
    isGuest: derived((state: SignInState) => {
        return state.user?.isGuest ?? true;
    }),
})
export const state: SignInState = getInitialSignInState();
