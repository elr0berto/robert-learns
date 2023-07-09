import {Context} from "..";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";

export const deleteCardStart = async ({ state, effects, actions }: Context, card: Card) => {
    state.workspaceCardSet.loadingDeleteCardModal = true;
    state.workspaceCardSet.cardIdBeingDeleted = card.id;

    if (state.page.workspaceId === null) {
        throw new Error('Workspace ID is null');
    }

    await actions.data.loadCardsWithCardSets({workspaceId: state.page.workspaceId, cardIds: [card.id]});
    state.workspaceCardSet.confirmingDeleteCard = false;
    state.workspaceCardSet.loadingDeleteCardModal = false;
}

export const deleteCardConfirm = async ({ state, effects, actions }: Context,) => {
    state.workspaceCardSet.confirmingDeleteCard = true;

    if (state.page.cardSetId === null) {
        throw new Error('Card set ID is null');
    }
    if (state.workspaceCardSet.cardIdBeingDeleted === null) {
        throw new Error('Card ID is null');
    }
    await effects.api.cards.deleteCard({cardId: state.workspaceCardSet.cardIdBeingDeleted, cardSetId: state.page.cardSetId});

    actions.data.deleteCard({cardId: state.workspaceCardSet.cardIdBeingDeleted, cardSetId: state.page.cardSetId});

    state.workspaceCardSet.cardIdBeingDeleted = null;
    state.workspaceCardSet.confirmingDeleteCard = false;
}

export const deleteCardCancel = async ({ state }: Context,) => {
    if (state.workspaceCardSet.confirmingDeleteCard) {
        return;
    }
    state.workspaceCardSet.cardIdBeingDeleted = null;
    state.workspaceCardSet.confirmingDeleteCard = false;
}