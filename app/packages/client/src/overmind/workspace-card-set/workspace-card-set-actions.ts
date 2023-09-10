import {Context} from "..";
import {Card, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Pages, pageUrls} from "../../page-urls";

export const deleteCardSet = async ({state} : Context) => {
    if (state.workspaceCardSet.deletingCardSet) {
        return;
    }
    state.workspaceCardSet.deleteCardSetError = null;
    state.workspaceCardSet.deleteCardSetModalOpen = true;
}

export const deleteCardSetClose = async ({state} : Context) => {
    state.workspaceCardSet.deleteCardSetModalOpen = false;
}

export const deleteCardSetConfirm = async ({state,effects,actions} : Context) => {
    state.workspaceCardSet.deletingCardSet = true;
    state.workspaceCardSet.deleteCardSetError = null;

    const cardSetId = state.page.cardSetId;

    if (cardSetId === null) {
        throw new Error('cardSet id is null');
    }

    const resp = await effects.api.cardSets.deleteCardSet({cardSetId});

    if (resp.status !== ResponseStatus.Success) {
        state.workspaceCardSet.deleteCardSetError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        state.workspaceCardSet.deletingCardSet = false;
        return;
    }

    state.notifications.notifications.push({
        message: 'Card set deleted',
    });

    actions.data.deleteCardSet(cardSetId);
    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }
    effects.page.router.goTo(pageUrls[Pages.Workspace].url(state.page.workspace));
}

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

export const deleteCardConfirm = async ({ state, effects, actions }: Context) => {
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

export const deleteCardCancel = async ({ state }: Context) => {
    if (state.workspaceCardSet.confirmingDeleteCard) {
        return;
    }
    state.workspaceCardSet.cardIdBeingDeleted = null;
    state.workspaceCardSet.confirmingDeleteCard = false;
}

export const sortCardSet = async ({ state }: Context) => {
    state.workspaceCardSet.sorting = true;
}

export type SortDirection = 'first' | 'last' | 'up' | 'down';
export const sortCard = async ({ state }: Context, {cardId, direction}: {cardId: number, direction: SortDirection}) => {
    console.log('sortCard cardId: ' + cardId + ' direction: ' + direction);
}