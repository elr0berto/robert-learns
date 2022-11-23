import {Context} from "../index";

export const _loadCards = async ({ state, effects }: Context) => {
    if (state.workspaceCardSet.cardSet === null) {
        return;
    }
    state.workspaceCardSet.cardsLoading = true;
    const resp = await effects.api.cardSets.cardSetCardList(state.workspaceCardSet.cardSet);
    state.workspaceCardSet.cards = resp.cards;
    state.workspaceCardSet.cardsLoading = false;
}