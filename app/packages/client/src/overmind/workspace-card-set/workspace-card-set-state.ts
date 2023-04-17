import {derived} from "overmind";
import {config} from "../index.js";
import {CardSet, Card } from "@elr0berto/robert-learns-shared/dist/api/models";
import {UserRole} from "@elr0berto/robert-learns-shared/dist/types";

type WorkspaceCardSetState = {
    cardSetId: number | null;
    cardsLoading: boolean;
    cards: Card[];
    cardIdBeingDeleted: number | null;
    readonly cardBeingDeleted: Card | null;
    cardBeingDeletedExistsInOtherCardSets: CardSet[] | null;
    confirmingDeleteCard: boolean;
    readonly showConfirmDeleteModal: boolean;
    readonly cardSet: CardSet | null;
    readonly currentUserCanEdit: boolean | null;
    readonly currentUserCanCreateCards: boolean | null;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    cardSetId: null,
    cardsLoading: false,
    cards: [],
    cardIdBeingDeleted: null,
    cardBeingDeleted: derived((state: WorkspaceCardSetState) => {
        if (state.cardIdBeingDeleted === null) {
            return null;
        }
        const found = state.cards.filter(c => c.id === state.cardIdBeingDeleted);
        if (found.length !== 1) {
            return null;
        }
        return found[0];
    }),
    cardBeingDeletedExistsInOtherCardSets: null,
    confirmingDeleteCard: false,
    showConfirmDeleteModal: derived((state: WorkspaceCardSetState) => {
        return state.cardBeingDeletedExistsInOtherCardSets !== null;
    }),
    cardSet: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }

        const found = rootState.workspace.cardSets.filter(cs => cs.id === state.cardSetId);
        if (found.length !== 1) {
            return null;
        }
        return found[0];
    }),
    currentUserCanEdit: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardSet === null || rootState.workspace.workspace === null) {
            return null;
        }
        return rootState.workspace.workspace.myRoleIsAtLeast(UserRole.ADMINISTRATOR);
    }),
    currentUserCanCreateCards: derived((state: WorkspaceCardSetState, rootState: typeof config.state) => {
        if (state.cardSet === null || rootState.workspace.workspace === null) {
            return null;
        }
        return rootState.workspace.workspace.myRoleIsAtLeast(UserRole.CONTRIBUTOR);
    }),
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();