import {Context} from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";


export const verifyEmail = async ({ state, effects, actions }: Context, token: string) => {
    state.verifyEmailPage.verifying = true;
    const resp = await effects.api.signIn.verifyEmail({token: token});

    if (resp.status !== ResponseStatus.Success) {
        state.verifyEmailPage.errorMessage = resp.errorMessage ?? 'Unexpected error';
        state.verifyEmailPage.verifying = false;
        return;
    }

    await actions.signIn.check();
    state.verifyEmailPage.verifying = false;
}