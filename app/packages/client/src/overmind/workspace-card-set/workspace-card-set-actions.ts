import {Context} from "../index";

export const _loadCards = async ({ state, effects, actions }: Context) => {
    state.workspaceCardSet.cardsLoading = true;
    const resp = await effects.api.cardSets.cardSetCardList(state.workspaceCardSet.cardSet!);
    state.workspaceCardSet.cards = resp.cards;
    state.workspaceCardSet.cardsLoading = false;
}