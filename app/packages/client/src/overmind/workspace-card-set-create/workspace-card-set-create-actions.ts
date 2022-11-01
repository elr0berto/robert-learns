import {Context} from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";
import {Pages, pageUrls} from "../../page-urls";

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
        name: state.workspaceCardSetCreate.form.name,
        workspaceId: state.workspace.workspaceId!,
    });

    if (resp.status !== ResponseStatus.Success || resp.cardSetId === null) {
        state.workspaceCardSetCreate.form.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        state.workspaceCardSetCreate.form.submitting = false;
        return;
    }

    await actions.workspace._loadCardSets();
    effects.page.router.goTo(pageUrls[Pages.WorkspaceCardSet].url(state.workspace.workspace!, {id: resp.cardSetId, name: state.workspaceCardSetCreate.form.name}))
    state.workspaceCardSetCreate.form.submitting = false;
}