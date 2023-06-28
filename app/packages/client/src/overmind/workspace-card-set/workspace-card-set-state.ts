import {derived} from "overmind";
import {config} from "../index.js";
import {CardSet, Card } from "@elr0berto/robert-learns-shared/dist/api/models";
import {CardWithCardSets} from "../data/data-state";

type WorkspaceCardSetState = {
    loadingDeleteCardModal: boolean;
    cardIdBeingDeleted: number | null;
    readonly cardWithCardSetsBeingDeleted: CardWithCardSets | null;
    readonly cardBeingDeletedExistsInOtherCardSets: CardSet[];
    confirmingDeleteCard: boolean;
    readonly showConfirmDeleteModal: boolean;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    loadingDeleteCardModal: false,
    cardIdBeingDeleted: null,
    cardWithCardSetsBeingDeleted: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardIdBeingDeleted === null) {
            return null;
        }

        return rootState.page.cardsWithCardSets.find(c => c.card.id === state.cardIdBeingDeleted)!;
    }),
    cardBeingDeletedExistsInOtherCardSets: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardWithCardSetsBeingDeleted === null) {
            return [];
        }

        return state.cardWithCardSetsBeingDeleted.cardSets.filter(cs => cs.id !== rootState.page.cardSet!.id);
    }),
    confirmingDeleteCard: false,
    showConfirmDeleteModal: derived((state: WorkspaceCardSetState) => {
        return state.cardIdBeingDeleted !== null;
    }),
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();