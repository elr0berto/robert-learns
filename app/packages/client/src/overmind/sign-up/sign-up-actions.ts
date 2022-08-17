import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";

export const changeFirstName = ({ state }: Context, newVal: string) => {
    state.signUp.firstName = newVal;
};
export const changeLastName = ({ state }: Context, newVal: string) => {
    state.signUp.lastName = newVal;
};
export const changeUsername = ({ state }: Context, newVal: string) => {
    state.signUp.username = newVal;
};
export const changeEmail = ({ state }: Context, newVal: string) => {
    state.signUp.email = newVal;
};
export const changePassword1 = ({ state }: Context, newVal: string) => {
    state.signUp.password1 = newVal;
};
export const changePassword2 = ({ state }: Context, newVal: string) => {
    state.signUp.password2 = newVal;
};
export const submit = async ({state,effects} : Context) => {
    state.signUp.submitAttempted = true;

    state.signUp.submissionError = '';
    if (!state.signUp.isValid) {
        return;
    }

    state.signUp.submitting = true;
    const resp = await effects.api.signUp.signUp({
        username: state.signUp.username,
        firstName: state.signUp.firstName,
        lastName: state.signUp.lastName,
        email: state.signUp.email,
        password: state.signUp.password1
    });

    state.signUp.submitting = false;
    if (resp.status !== ResponseStatus.Success) {
        state.signUp.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    if (resp.user === null) {
        state.signUp.submissionError = "Unexpected error. Please refresh the page and try again later."
        return;
    }
    state.signIn.user = resp.user;
    effects.page.router.goTo('/');
}