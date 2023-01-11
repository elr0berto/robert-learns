import {Context} from "..";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {removeItem} from "@elr0berto/robert-learns-shared/dist/common";

export const _loadCards = async ({ state, effects }: Context) => {
    if (state.workspaceCardSet.cardSet === null) {
        return;
    }
    state.workspaceCardSet.cardsLoading = true;
    const resp = await effects.api.cardSets.cardSetCardList(state.workspaceCardSet.cardSet);
    state.workspaceCardSet.cards = resp.cards;
    state.workspaceCardSet.cardsLoading = false;
}

export const deleteCard = async ({ state, effects }: Context, card: Card) => {
    state.workspaceCardSet.cardsBeingDeleted.push(card);
    const resp = await effects.api.cardSets.deleteCard(state.workspaceCardSet, card);
    state.workspaceCardSet.cards = removeItem(state.workspaceCardSet.cards, card);
    state.workspaceCardSet.cardsBeingDeleted = removeItem(state.workspaceCardSet.cardsBeingDeleted, card);
}