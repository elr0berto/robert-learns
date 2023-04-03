import {derived} from "overmind";
import {config} from "../index.js";
import {CardSet, Card } from "@elr0berto/robert-learns-shared/dist/api/models";
import {UserRole} from "@elr0berto/robert-learns-shared/dist/types";

type WorkspaceCardSetState = {
    cardSetId: number | null;
    cardsLoading: boolean;
    cards: Card[];
    cardBeingDeleted: Card | null;
    cardBeingDeletedExistsInOtherCardSets: CardSet[] | null;
    confirmingDeleteCard: boolean;
    readonly showConfirmDeleteModal: boolean;
    readonly cardSet: CardSet | null;
    readonly currentUserCanEdit: boolean | null;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    cardSetId: null,
    cardsLoading: false,
    cards: [],
    cardBeingDeleted: null,
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
    currentUserCanEdit: derived((state: WorkspaceCardSetState) => {
        if (state.cardSet === null) {
            return null;
        }
        return state.cardSet.myRoleIsAtLeast(UserRole.ADMINISTRATOR);
    }),
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();