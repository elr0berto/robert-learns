import {derived} from "overmind";
import {config} from "../index.js";
import {CardSet, Card } from "@elr0berto/robert-learns-shared/dist/api/models";

type WorkspaceCardSetState = {
    cardSetId: number | null;
    cardsLoading: boolean;
    cards: Card[];
    cardIdsBeingDeleted: number[];
    readonly cardSet: CardSet | null;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    cardSetId: null,
    cardsLoading: false,
    cards: [],
    cardIdsBeingDeleted: [],
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
});

export const state: WorkspaceCardSetState = getInitialWorkspaceCardSetState();