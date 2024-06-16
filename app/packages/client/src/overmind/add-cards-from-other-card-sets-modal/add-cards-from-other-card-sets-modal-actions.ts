import {Context} from "..";
import {getInitialAddCardsFromOtherCardSetsModalState} from "./add-cards-from-other-card-sets-modal-state";
import {pageUrls, Pages} from "../../page-urls";

export const open = async ({ state, effects, actions }: Context, cardSetId: number) => {
    state.addCardsFromOtherCardSetsModal = getInitialAddCardsFromOtherCardSetsModalState();
    state.addCardsFromOtherCardSetsModal.loading = true;
    state.addCardsFromOtherCardSetsModal.open = true;

    if (state.page.workspaceId === null) {
        throw new Error('Workspace ID is null');
    }

    await actions.data.loadCardSets([state.page.workspaceId]);
    const cardSetIds = state.data.cardSets.filter(cs => cs.workspaceId === state.page.workspaceId).map(cs => cs.id);
    await actions.data.loadCardSetCards({cardSetIds});
    const cardIds = state.data.cardSetCards.filter(csc => cardSetIds.includes(csc.cardSetId)).map(csc => csc.cardId);

    await actions.data.loadCards(Array.from(new Set(cardIds)));

    state.addCardsFromOtherCardSetsModal.loading = false;
}
export const close = async ({ state }: Context) => {
    state.addCardsFromOtherCardSetsModal.open = false;
}

export const setSelected = async ({ state }: Context, {cardId, selected}: {cardId: number, selected: boolean}) => {
    console.log('setSelected 1');
    if (selected) {
        state.addCardsFromOtherCardSetsModal.selectedCardIds = [...state.addCardsFromOtherCardSetsModal.selectedCardIds, cardId];
    } else {
        state.addCardsFromOtherCardSetsModal.selectedCardIds = state.addCardsFromOtherCardSetsModal.selectedCardIds.filter(id => id !== cardId);
    }
    console.log('setSelected 2');
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

    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }
    if (state.page.cardSet === null) {
        throw new Error('Card Set is null');
    }
    effects.page.router.goTo(pageUrls[Pages.WorkspaceCardSet].url(state.page.workspace, state.page.cardSet));
}