import {Context} from "..";
import {getInitialAddCardsFromOtherCardSetsModalState} from "./add-cards-from-other-card-sets-modal-state";

export const open = async ({ state, effects }: Context, cardSetId: number) => {
    state.addCardsFromOtherCardSetsModal = getInitialAddCardsFromOtherCardSetsModalState();
    state.addCardsFromOtherCardSetsModal.loading = true;
    state.addCardsFromOtherCardSetsModal.cardSetId = cardSetId;

    const cardSetsResp = await effects.api.cardSets.getCardSets({workspaceId: state.workspace.workspaceId!});
    state.addCardsFromOtherCardSetsModal.cardSets = cardSetsResp.cardSets;
    const cardsResp = await effects.api.cards.getCards({cardSetIds: cardSetsResp.cardSets.map(cs => cs.id)});
    state.addCardsFromOtherCardSetsModal.cards = cardsResp.cards;
    const cardSetCardsResp = await effects.api.cardSetCards.getCardSetCards({cardSetIds: cardSetsResp.cardSets.map(cs => cs.id)});
    state.addCardsFromOtherCardSetsModal.cardSetCards = cardSetCardsResp.cardSetCards;
    state.addCardsFromOtherCardSetsModal.loading = false;
}
export const close = async ({ state }: Context) => {
    state.addCardsFromOtherCardSetsModal.cardSetId = null;
}

export const setSelected = async ({ state }: Context, {cardId, selected}: {cardId: number, selected: boolean}) => {
    if (selected) {
        state.addCardsFromOtherCardSetsModal.selectedCardIds.push(cardId);
    } else {
        state.addCardsFromOtherCardSetsModal.selectedCardIds = state.addCardsFromOtherCardSetsModal.selectedCardIds.filter(id => id !== cardId);
    }
}