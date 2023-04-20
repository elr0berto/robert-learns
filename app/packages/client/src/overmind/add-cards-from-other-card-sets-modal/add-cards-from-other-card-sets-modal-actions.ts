import {Context} from "..";
import {getInitialAddCardsFromOtherCardSetsModalState} from "./add-cards-from-other-card-sets-modal-state";

export const open = async ({ state, effects }: Context, cardSetId: number) => {
    state.addCardsFromOtherCardSetsModal = getInitialAddCardsFromOtherCardSetsModalState();
    state.addCardsFromOtherCardSetsModal.loading = true;
    state.addCardsFromOtherCardSetsModal.cardSetId = cardSetId;

    const cardSetsResp = await effects.api
}

export const close = async ({ state }: Context) => {
    state.addCardsFromOtherCardSetsModal.cardSetId = null;
}