import {Context} from "..";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";

export const deleteCardStart = async ({ state, effects, actions }: Context, card: Card) => {
    state.workspaceCardSet.loadingDeleteCardModal = true;
    state.workspaceCardSet.cardIdBeingDeleted = card.id;
    //const resp = await effects.api.cards.deleteCard({cardId: card.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: false});
    await actions.data.loadCardsWithCardSets({workspaceId: state.page.workspaceId!, cardIds: [card.id]});
    state.workspaceCardSet.confirmingDeleteCard = false;
    state.workspaceCardSet.loadingDeleteCardModal = false;
}

export const deleteCardConfirm = async ({ state, effects, actions }: Context,) => {
    state.workspaceCardSet.confirmingDeleteCard = true;

    await effects.api.cards.deleteCard({cardId: state.workspaceCardSet.cardIdBeingDeleted!, cardSetId: state.page.cardSetId!});

    actions.data.deleteCard({cardId: state.workspaceCardSet.cardIdBeingDeleted!, cardSetId: state.page.cardSetId!});

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