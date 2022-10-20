import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";

export const changeFormName = ({ state }: Context, name: string) => {
    state.workspaceCreate.form.name = name;
};

export const changeFormDescription = ({ state }: Context, desc: string) => {
    state.workspaceCreate.form.description = desc;
};

export const formSubmit = async ({state,effects,actions} : Context) => {
    state.workspaceCreate.form.submitAttempted = true;

    state.workspaceCreate.form.submissionError = '';
    if (!state.workspaceCreate.form.isValid) {
        return;
    }

    state.workspaceCreate.form.submitting = true;
    const resp = await effects.api.workspaces.workspaceCreate({
        name: state.workspaceCreate.form.name,
        description: state.workspaceCreate.form.description,
    });

    state.workspaceCreate.form.submitting = false;
    if (resp.status !== ResponseStatus.Success) {
        state.workspaceCreate.form.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    actions.workspaces.getWorkspaceList();

    effects.page.router.goTo('/');
}