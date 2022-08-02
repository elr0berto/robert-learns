import {derived} from 'overmind'

type SignUpState = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password1: string;
    password2: string;
    submitting: boolean;
    submitAttempted: boolean;
    readonly submitDisabled: boolean;
    readonly isValid: boolean;
}

export const getInitialSignUpState = (): SignUpState => ({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password1: '',
    password2: '',
    submitting: false,
    submitAttempted: false,
    submitDisabled: derived((state: SignUpState) => {
        return state.submitting;
    }),
    isValid: derived((state: SignUpState) => {

    }),
})

export const state: SignUpState = getInitialSignUpState();
