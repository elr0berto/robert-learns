import {Context} from "../index";

export const _loadCards = async ({ state, effects, actions }: Context) => {
    state.workspaceCardSet.cardsLoading = true;
    const resp = await effects.api.cardSets.workspaceCardSetList(state.workspace.workspace!);
    state.workspace.cardSets = resp.cardSets;
    state.workspace.cardSetsLoading = false;
}