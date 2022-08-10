import {derived} from 'overmind'
import {ValidateSignUpSubmitRequest} from "@elr0berto/robert-learns-shared/dist/api/sign-up";

type SignUpState = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password1: string;
    password2: string;
    submitting: boolean;
    submitAttempted: boolean;
    submissionError: string;
    readonly submitDisabled: boolean;
    readonly validationErrors: string[];
    readonly isValid: boolean;
    readonly showErrors: boolean;
    readonly allErrors: string[];
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
    submissionError: '',
    submitDisabled: derived((state: SignUpState) => {
        return state.submitting;
    }),
    validationErrors: derived((state: SignUpState) => {
       let errors = ValidateSignUpSubmitRequest({
           username: state.username.trim(),
           email: state.email.trim(),
           firstName: state.firstName.trim(),
           lastName: state.lastName.trim(),
           password: state.password1,
       });
       if (state.password1 !== state.password2) {
           errors.push('Passwords are not matching');
       }
       return errors;
    }),
    isValid: derived((state: SignUpState) => {
        return state.validationErrors.length === 0;
    }),
    showErrors: derived((state: SignUpState) => {
        return state.submitAttempted && state.allErrors.length > 0;
    }),
    allErrors: derived((state: SignUpState) => {
        let errors = state.validationErrors;
        if (state.submissionError.length > 0) {
            errors.push(state.submissionError);
        }
        return errors;
    }),
})

export const state: SignUpState = getInitialSignUpState();
