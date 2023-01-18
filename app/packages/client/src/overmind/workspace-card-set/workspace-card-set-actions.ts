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

export const deleteCardStart = async ({ state, effects }: Context, card: Card) => {
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = null;
    state.workspaceCardSet.cardBeingDeleted = card;
    const resp = await effects.api.cardSets.cardSetDeleteCard({cardId: card.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: false});
    state.workspaceCardSet.confirmingDeleteCard = false;
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = resp.cardExistsInOtherCardSets;
}

export const deleteCardConfirm = async ({ state, effects }: Context,) => {
    state.workspaceCardSet.confirmingDeleteCard = true;
    const resp = await effects.api.cardSets.cardSetDeleteCard({cardId: state.workspaceCardSet.cardBeingDeleted!.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: true});
    state.workspaceCardSet.cards = removeItem(state.workspaceCardSet.cards, state.workspaceCardSet.cardBeingDeleted!);
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = null;
    state.workspaceCardSet.cardBeingDeleted = null;
    state.workspaceCardSet.confirmingDeleteCard = false;
}