import {derived} from "overmind";
import {config} from "../index.js";
import {CardSet } from "@elr0berto/robert-learns-shared/dist/api/models";
import {CardWithCardSets} from "../data/data-state";

type WorkspaceCardSetState = {
    deleteCardSetModalOpen: boolean;
    deletingCardSet: boolean;
    deleteCardSetError: string | null;
    loadingDeleteCardModal: boolean;
    cardIdBeingDeleted: number | null;
    readonly cardWithCardSetsBeingDeleted: CardWithCardSets | null;
    readonly cardBeingDeletedExistsInOtherCardSets: CardSet[];
    confirmingDeleteCard: boolean;
    readonly showConfirmDeleteModal: boolean;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    deleteCardSetModalOpen: false,
    deletingCardSet: false,
    deleteCardSetError: null,
    loadingDeleteCardModal: false,
    cardIdBeingDeleted: null,
    cardWithCardSetsBeingDeleted: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardIdBeingDeleted === null) {
            return null;
        }

        const ret = rootState.page.cardsWithCardSets.find(c => c.card.id === state.cardIdBeingDeleted);
        if (ret === undefined) {
            throw new Error('Card not found: ' + state.cardIdBeingDeleted);
        }
        return ret;
    }),
    cardBeingDeletedExistsInOtherCardSets: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardWithCardSetsBeingDeleted === null) {
            return [];
        }

        const cardSet = rootState.page.cardSet;
        if (cardSet === null) {
            throw new Error('Card set is null');
        }
        return state.cardWithCardSetsBeingDeleted.cardSets.filter(cs => cs.id !== cardSet.id);
    }),
    confirmingDeleteCard: false,
    showConfirmDeleteModal: derived((state: WorkspaceCardSetState) => {
        return state.cardIdBeingDeleted !== null;
    }),
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();