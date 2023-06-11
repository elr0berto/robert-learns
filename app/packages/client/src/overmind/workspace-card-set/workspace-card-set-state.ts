import {derived} from "overmind";
import {config} from "../index.js";
import {CardSet, Card } from "@elr0berto/robert-learns-shared/dist/api/models";

type WorkspaceCardSetState = {
    cardIdBeingDeleted: number | null;
    readonly cardBeingDeleted: Card | null;
    cardBeingDeletedExistsInOtherCardSets: CardSet[] | null;
    confirmingDeleteCard: boolean;
    readonly showConfirmDeleteModal: boolean;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    cardIdBeingDeleted: null,
    cardBeingDeleted: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardIdBeingDeleted === null) {
            return null;
        }

        return rootState.page.cardsInCurrentCardSet.find(c => c.id === state.cardIdBeingDeleted)!;
    }),
    cardBeingDeletedExistsInOtherCardSets: null,
    confirmingDeleteCard: false,
    showConfirmDeleteModal: derived((state: WorkspaceCardSetState) => {
        return state.cardBeingDeletedExistsInOtherCardSets !== null;
    }),
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();