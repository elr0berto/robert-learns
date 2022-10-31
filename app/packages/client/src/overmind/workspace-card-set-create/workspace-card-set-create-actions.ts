import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";

export const changeFormName = ({ state }: Context, name: string) => {
    state.workspaceCardSetCreate.form.name = name;
};


export const formSubmit = async ({state,effects,actions} : Context) => {
    state.workspaceCardSetCreate.form.submitAttempted = true;

    state.workspaceCardSetCreate.form.submissionError = '';
    if (!state.workspaceCardSetCreate.form.isValid) {
        return;
    }

    state.workspaceCardSetCreate.form.submitting = true;
    const resp = await effects.api.workspaces.workspaceCardSetCreate({
        name: state.workspaceCreate.form.name,
        workspaceId: state.workspace.workspaceId!,
    });

    state.workspaceCardSetCreate.form.submitting = false;
    if (resp.status !== ResponseStatus.Success) {
        state.workspaceCardSetCreate.form.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    effects.page.router.goTo('/');
}