import {Context} from "..";
import {getInitialLinkCardSetsModalState} from "./link-card-sets-modal-state";
import {Pages, pageUrls} from "../../page-urls";

export const open = async ({ state, actions }: Context, cardSetId: number) => {
    state.linkCardSetsModal = getInitialLinkCardSetsModalState(cardSetId);

    if (state.page.workspaceId === null) {
        throw new Error('Workspace ID is null');
    }

    await actions.data.loadCardSets([state.page.workspaceId]);
    const cardSetIds = state.data.cardSets.filter(cs => cs.workspaceId === state.page.workspaceId).map(cs => cs.id);
    await actions.data.loadCardSetLinks({cardSetIds});
    await actions.data.loadCardSetCards({cardSetIds});
    const cardIds = state.data.cardSetCards.filter(csc => cardSetIds.includes(csc.cardSetId)).map(csc => csc.cardId);

    await actions.data.loadCards(Array.from(new Set(cardIds)));
    state.linkCardSetsModal.selectedCardSetIds = state.data.cardSetLinks.filter(csl => csl.parentCardSetId === cardSetId).map(csl => csl.includedCardSetId);
    state.linkCardSetsModal.originalSelectedCardSetIds = state.linkCardSetsModal.selectedCardSetIds.slice(); // use slice to clone it.
    state.linkCardSetsModal.loading = false;
}
export const close = async ({ state }: Context) => {
    state.linkCardSetsModal.cardSetId = null;
}

export const toggleCardSetId = ({ state }: Context, cardSetId: number) => {
    const index = state.linkCardSetsModal.selectedCardSetIds.indexOf(cardSetId);
    if (index === -1) {
        state.linkCardSetsModal.selectedCardSetIds.push(cardSetId);
    } else {
        state.linkCardSetsModal.selectedCardSetIds.splice(index, 1);
    }
}

export const save = async ({ state, effects, actions }: Context) => {
    if (state.linkCardSetsModal.disabled) {
        return;
    }

    state.linkCardSetsModal.saving = true;

    if (state.linkCardSetsModal.cardSetId === null) {
        throw new Error('cardSetId is null');
    }
    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }
    if (state.page.cardSet === null) {
        throw new Error('Card Set is null');
    }

    await effects.api.cardSetLinks.setCardSetLinks({
        parentCardSetId: state.linkCardSetsModal.cardSetId,
        cardSetIds: state.linkCardSetsModal.selectedCardSetIds,
    });

    window.location.reload();
}