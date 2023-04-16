import {Context} from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Pages, pageUrls} from "../../page-urls";
import {WorkspaceCardSetCreateRequest} from "@elr0berto/robert-learns-shared/dist/api/workspaces";

export const changeFormName = ({ state }: Context, name: string) => {
    state.workspaceCardSetCreate.form.name = name;
};

export const changeFormDescription = ({ state }: Context, description: string) => {
    state.workspaceCardSetCreate.form.description = description;
};

export const formSubmit = async ({state,effects,actions} : Context, scope: string) => {
    state.workspaceCardSetCreate.form.submitAttempted = true;

    state.workspaceCardSetCreate.form.submissionError = '';
    if (!state.workspaceCardSetCreate.form.isValid) {
        return;
    }

    state.workspaceCardSetCreate.form.submitting = true;

    let request : WorkspaceCardSetCreateRequest = {
        name: state.workspaceCardSetCreate.form.name,
        description: state.workspaceCardSetCreate.form.description,
        workspaceId: state.workspace.workspaceId!,
    };

    if (scope === 'edit') {
        request.cardSetId = state.workspaceCardSet.cardSetId!;
    }

    const resp = await effects.api.workspaces.workspaceCardSetCreate(request);

    if (resp.status !== ResponseStatus.Success || resp.cardSet === null) {
        state.workspaceCardSetCreate.form.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        state.workspaceCardSetCreate.form.submitting = false;
        return;
    }

    await actions.workspace._loadCardSets();
    effects.page.router.goTo(pageUrls[Pages.WorkspaceCardSet].url(state.workspace.workspace!, {id: resp.cardSet.id, name: state.workspaceCardSetCreate.form.name}))
    state.workspaceCardSetCreate.form.submitting = false;
}