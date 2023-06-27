import {Context} from "..";
import {getInitialEditCardCardSetsModalState} from "./edit-card-card-sets-modal-state";
import {addOrUpdateCardSetCardsForCard} from "../data/data-actions";

export const open = async ({ state, effects, actions }: Context, cardId: number) => {
    state.editCardCardSetsModal = getInitialEditCardCardSetsModalState();
    state.editCardCardSetsModal.cardId = cardId;
    state.editCardCardSetsModal.selectedCardSetIds = state.editCardCardSetsModal.cardWithCardSets!.cardSets.map(cs => cs.id);
    state.editCardCardSetsModal.loading = true;

    await actions.data.loadCardSets(state.page.workspaceId!);

    state.editCardCardSetsModal.loading = false;
}
export const close = async ({ state }: Context) => {
    state.editCardCardSetsModal.cardId = null;
}

export const setSelectedCardSetId = ({state}: Context, {cardSetId, selected}: {cardSetId: number, selected: boolean}) => {
    if (selected) {
        state.editCardCardSetsModal.selectedCardSetIds.push(cardSetId);
    } else {
        state.editCardCardSetsModal.selectedCardSetIds = state.editCardCardSetsModal.selectedCardSetIds.filter(id => id !== cardSetId);
    }
}

export const save = async ({ state, effects, actions }: Context,) => {
    state.editCardCardSetsModal.submitError = null;
    state.editCardCardSetsModal.submitting = true;

    const resp = await effects.api.cardSetCards.updateCardCardSets({cardId: state.editCardCardSetsModal.cardId!, cardSetIds: state.editCardCardSetsModal.selectedCardSetIds});

    actions.data.addOrUpdateCardSetCardsForCard({card: state.editCardCardSetsModal.cardWithCardSets!.card, cardSetCards: resp.cardSetCards! });

    state.editCardCardSetsModal.submitting = false;
    state.editCardCardSetsModal.cardId = null;
}