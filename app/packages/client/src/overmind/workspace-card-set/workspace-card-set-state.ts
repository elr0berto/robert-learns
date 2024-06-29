import {derived} from "overmind";
import {config} from "../index.js";
import {
    CardSetWithFlatAncestorCardSets,
    CardWithCardSetsWithFlatAncestorCardSets
} from "../data/data-state";

type WorkspaceCardSetState = {
    deleteCardSetModalOpen: boolean;
    deletingCardSet: boolean;
    deleteCardSetError: string | null;
    loadingDeleteCardModal: boolean;
    cardIdBeingDeleted: number | null;
    readonly cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted: CardWithCardSetsWithFlatAncestorCardSets | null;
    readonly cardBeingDeletedExistsInOtherCardSets: CardSetWithFlatAncestorCardSets[];
    confirmingDeleteCard: boolean;
    readonly showConfirmDeleteModal: boolean;
    sorting: boolean;
    readonly cardsWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets[];
    newSorting: number[] | null;
    savingSorting: boolean;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    deleteCardSetModalOpen: false,
    deletingCardSet: false,
    deleteCardSetError: null,
    loadingDeleteCardModal: false,
    cardIdBeingDeleted: null,
    cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardIdBeingDeleted === null) {
            return null;
        }

        const ret = rootState.page.cardsWithCardSetsWithFlatAncestorCardSets.find(c => c.card.id === state.cardIdBeingDeleted);
        if (ret === undefined) {
            throw new Error('Card not found: ' + state.cardIdBeingDeleted);
        }
        return ret;
    }),
    cardBeingDeletedExistsInOtherCardSets: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted === null) {
            return [];
        }

        const cardSet = rootState.page.cardSet;
        if (cardSet === null) {
            throw new Error('Card set is null');
        }
        return state.cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted.cardSetsWithFlatAncestorCardSets.filter(cs => cs.cardSet.id !== cardSet.id);
    }),
    confirmingDeleteCard: false,
    showConfirmDeleteModal: derived((state: WorkspaceCardSetState) => {
        return state.cardIdBeingDeleted !== null;
    }),
    sorting: false,
    cardsWithCardSetsWithFlatAncestorCardSets: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.newSorting !== null) {
            return state.newSorting.map(id => {
                const cardWithCardSetsWithFlatAncestorCardSets = rootState.page.cardsWithCardSetsWithFlatAncestorCardSets.find(cwcs => cwcs.card.id === id);
                if (cardWithCardSetsWithFlatAncestorCardSets === undefined) {
                    throw new Error('Could not find card with card sets');
                }
                return cardWithCardSetsWithFlatAncestorCardSets;
            });
        }
        return rootState.page.cardsWithCardSetsWithFlatAncestorCardSets;
    }),
    newSorting: null,
    savingSorting: false,
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();