import { Context } from '..';

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
    if (!state.signUp.isValid) {
        return;
    }
    const resp = await effects.api.signUp.submit();

}