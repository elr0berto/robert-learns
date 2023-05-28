import {Context} from "..";
import {getInitialEditCardCardSetsModalState} from "./edit-card-card-sets-modal-state";

export const open = async ({ state, effects }: Context, cardSetId: number) => {
    state.editCardCardSetsModal = getInitialEditCardCardSetsModalState();
    state.editCardCardSetsModal.loading = true;

    const cardSetsResp = await effects.api.cardSets.getCardSets({workspaceId: state.workspace.workspaceId!});
    state.editCardCardSetsModal.cardSets = cardSetsResp.cardSets;

    state.editCardCardSetsModal.loading = false;
}
export const close = async ({ state }: Context) => {
    state.editCardCardSetsModal.cardId = null;
}

export const save = async ({ state, effects }: Context,) => {
    state.editCardCardSetsModal.submitError = null;
    state.editCardCardSetsModal.submitting = true;

    await effects.api.cardSetCards.updateCardCardSets({cardId: state.editCardCardSetsModal.cardId!, selectedCardSetIds: state.editCardCardSetsModal.selectedCardSetIds});

    effects.page.reloadPage();
}