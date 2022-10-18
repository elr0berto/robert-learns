import { Context } from '..';
import {Pages} from "../../page-urls";
import {Payload} from "../page/page-actions";

export const showWorkspacePage = async ({ state, effects, actions }: Context, payload: Payload) => {
    actions.page._loadAllData();
    state.page.current = Pages.Workspace
    console.log('showWorkspacePage', payload.params?.id);
    if (payload.params?.id) {
        state.workspace.workspaceId = +payload.params.id;
        actions.workspace._loadCardSets();
    }
}

export const _loadCardSets = async ({ state, effects, actions }: Context) => {
    state.workspace.cardSetsLoading = true;
    const resp = await effects.api.workspaces.workspaceCardSetList(state.workspace.workspace!);
    state.workspace.cardSets = resp.cardSets;
    state.workspace.cardSetsLoading = false;
}