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
    state.workspaceCardSet.cardIdBeingDeleted = card.id;
    const resp = await effects.api.cardSets.cardSetDeleteCard({cardId: card.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: false});
    state.workspaceCardSet.confirmingDeleteCard = false;
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = resp.cardExistsInOtherCardSets;
}

export const deleteCardConfirm = async ({ state, effects }: Context,) => {
    console.log('deleteCardconfirm 1');
    state.workspaceCardSet.confirmingDeleteCard = true;
    console.log('deleteCardconfirm 2');
    const resp = await effects.api.cardSets.cardSetDeleteCard({cardId: state.workspaceCardSet.cardBeingDeleted!.id, cardSetId: state.workspaceCardSet.cardSetId!, confirm: true});
    console.log('deleteCardconfirm state.workspaceCardSet.cards', state.workspaceCardSet.cards);
    console.log('deleteCardconfirm state.workspaceCardSet.cards.length', state.workspaceCardSet.cards.length);

    console.log('deleteCardconfirm state.workspaceCardSet.cardBeingDeleted', state.workspaceCardSet.cardBeingDeleted);

    // remove card from state.workspaceCardSet.cards based on cardBeingDeleted.id
    const newCards = state.workspaceCardSet.cards.filter(c => c.id !== state.workspaceCardSet.cardBeingDeleted!.id);

    console.log('deleteCardconfirm newCards', newCards);
    console.log('deleteCardconfirm newCards.length', newCards.length);

    // copy newCards to state.workspaceCardSet.cards
    state.workspaceCardSet.cards = [...newCards];
    console.log('deleteCardconfirm 4');
    state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets = null;
    console.log('deleteCardconfirm 5');
    state.workspaceCardSet.cardIdBeingDeleted = null;
    console.log('deleteCardconfirm 6');
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