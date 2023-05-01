import {Context} from "..";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";

export const _loadCards = async ({ state, effects }: Context) => {
    if (state.workspaceCardSet.cardSet === null) {
        return;
    }
    state.workspaceCardSet.cardsLoading = true;
    const resp = await effects.api.cards.getCards({cardSetIds: [state.workspaceCardSet.cardSet.id]});
    state.workspaceCardSet.cards = resp.cards;
    state.workspaceCardSet.cardsLoading = false;
}

export const deleteCardStart = async ({ state, effects }: Context, card: Card) => {
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = null;
    state.workspaceCardSet.cardIdBeingDeleted = card.id;
    const resp = await effects.api.cards.deleteCard({cardId: card.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: false});
    state.workspaceCardSet.confirmingDeleteCard = false;
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = resp.cardExistsInOtherCardSets;
}

export const deleteCardConfirm = async ({ state, effects }: Context,) => {
    state.workspaceCardSet.confirmingDeleteCard = true;
    await effects.api.cards.deleteCard({cardId: state.workspaceCardSet.cardBeingDeleted!.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: true});

    // remove card from state.workspaceCardSet.cards based on cardBeingDeleted.id
    const newCards = state.workspaceCardSet.cards.filter(c => c.id !== state.workspaceCardSet.cardBeingDeleted!.id);

    // copy newCards to state.workspaceCardSet.cards
    state.workspaceCardSet.cards = [...newCards];
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = null;
    state.workspaceCardSet.cardIdBeingDeleted = null;
    state.workspaceCardSet.confirmingDeleteCard = false;
}

export const deleteCardCancel = async ({ state }: Context,) => {
    if (state.workspaceCardSet.confirmingDeleteCard) {
        return;
    }
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = null;
    state.workspaceCardSet.cardIdBeingDeleted = null;
    state.workspaceCardSet.confirmingDeleteCard = false;
}