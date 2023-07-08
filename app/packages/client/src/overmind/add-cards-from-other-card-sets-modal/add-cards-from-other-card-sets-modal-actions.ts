import {Context} from "..";
import {getInitialAddCardsFromOtherCardSetsModalState} from "./add-cards-from-other-card-sets-modal-state";

export const open = async ({ state, effects, actions }: Context, cardSetId: number) => {
    state.addCardsFromOtherCardSetsModal = getInitialAddCardsFromOtherCardSetsModalState();
    state.addCardsFromOtherCardSetsModal.loading = true;
    state.addCardsFromOtherCardSetsModal.open = true;

    if (state.page.workspaceId === null) {
        throw new Error('Workspace ID is null');
    }

    await actions.data.loadCardSets(state.page.workspaceId);
    await actions.data.loadCards(state.data.cardSets.filter(cs => cs.workspaceId === state.page.workspaceId).map(cs => cs.id));

    state.addCardsFromOtherCardSetsModal.loading = false;
}
export const close = async ({ state }: Context) => {
    state.addCardsFromOtherCardSetsModal.open = false;
}

export const setSelected = async ({ state }: Context, {cardId, selected}: {cardId: number, selected: boolean}) => {
    if (selected) {
        state.addCardsFromOtherCardSetsModal.selectedCardIds.push(cardId);
    } else {
        state.addCardsFromOtherCardSetsModal.selectedCardIds = state.addCardsFromOtherCardSetsModal.selectedCardIds.filter(id => id !== cardId);
    }
}

export const save = async ({ state, effects, actions }: Context,) => {
    if (state.addCardsFromOtherCardSetsModal.selectedCardIds.length === 0) {
        state.addCardsFromOtherCardSetsModal.submitError = "Please select at least one card to add.";
        return;
    }
    state.addCardsFromOtherCardSetsModal.submitError = null;
    state.addCardsFromOtherCardSetsModal.submitting = true;

    const cardSetId = state.page.cardSetId;

    if (cardSetId === null) {
        throw new Error('Card Set ID is null');
    }

    const cardIds = state.addCardsFromOtherCardSetsModal.selectedCardIds;
    await effects.api.cardSetCards.createCardSetCards({cardSetId, cardIds});

    state.addCardsFromOtherCardSetsModal.open = false;
    await actions.page.load();
}