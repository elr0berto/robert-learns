import {Context} from "..";
import {Card, ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Pages, pageUrls} from "../../page-urls";
import {DeleteCardRequest} from "@elr0berto/robert-learns-shared/dist/api/cards";
import {SortDirection, sortWithDirection} from "@elr0berto/robert-learns-shared/dist/common";

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
    actions.notifications.addNotification('Card set deleted');

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

export const deleteCardConfirm = async ({ state, effects, actions }: Context, allCardSets: boolean) => {
    state.workspaceCardSet.confirmingDeleteCard = true;

    if (state.page.cardSetId === null) {
        throw new Error('Card set ID is null');
    }
    if (state.workspaceCardSet.cardIdBeingDeleted === null) {
        throw new Error('Card ID is null');
    }
    const req: DeleteCardRequest = {
        cardId: state.workspaceCardSet.cardIdBeingDeleted,
        allCardSets: allCardSets,
    };

    if (!allCardSets) {
        req.cardSetId = state.page.cardSetId;
    }
    await effects.api.cards.deleteCard(req);

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
    state.workspaceCardSet.newSorting = state.workspaceCardSet.cardsWithCardSetsWithFlatAncestorCardSets.map(cwcs => cwcs.card.id);
}

export const sortCard = async ({ state }: Context, {cardId, direction}: {cardId: number, direction: SortDirection}) => {
    if (state.workspaceCardSet.newSorting === null) {
        throw new Error('newSorting is null');
    }

    state.workspaceCardSet.newSorting = sortWithDirection(state.workspaceCardSet.newSorting, cardId, direction);
}

export const sortCardSetSave = async ({ state, effects, actions }: Context) => {
    state.workspaceCardSet.savingSorting = true;
    const resp = await effects.api.cardSetCards.updateCardSetCardsOrder({
        cardSetId: state.page.cardSetId ?? 0,
        cardIds: state.workspaceCardSet.newSorting ?? [],
    });
    if (resp.cardSetCards === null) {
        throw new Error('resp.cardSetCards is null');
    }
    actions.data.addOrUpdateCardSetCardsForCardSetId({
        cardSetId: state.page.cardSetId ?? 0,
        cardSetCards: resp.cardSetCards,
    });
    state.workspaceCardSet.savingSorting = false;
    state.workspaceCardSet.sorting = false;
    state.workspaceCardSet.newSorting = null;
}

export const sortCardSetCancel = async ({ state }: Context) => {
    state.workspaceCardSet.sorting = false;
    state.workspaceCardSet.newSorting = null;
}