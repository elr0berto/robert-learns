import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";

export const changeCreateFormName = ({ state }: Context, name: string) => {
    state.workspaces.createForm.name = name;
};

export const createFormSubmit = async ({state,effects} : Context) => {
    state.workspaces.createForm.submitAttempted = true;

    state.workspaces.createForm.submissionError = '';
    if (!state.workspaces.createForm.isValid) {
        return;
    }

    state.workspaces.createForm.submitting = true;
    const resp = await effects.api.workspaces.workspaceCreate({
        name: state.workspaces.createForm.name
    });

    state.workspaces.createForm.submitting = false;
    if (resp.status !== ResponseStatus.Success) {
        state.workspaces.createForm.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    effects.page.router.goTo('/');
}