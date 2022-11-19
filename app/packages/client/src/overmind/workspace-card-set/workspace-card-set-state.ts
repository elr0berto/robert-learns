import {derived} from "overmind";
import {config} from "../index";
import CardSet from "@elr0berto/robert-learns-shared/dist/api/models/CardSet";
import Card from "@elr0berto/robert-learns-shared/dist/api/models/Card";

type WorkspaceCardSetState = {
    cardSetId: number | null;
    cardsLoading: boolean;
    cards: Card[];
    readonly cardSet: CardSet | null;
}

export const getInitialWorkspaceCardSetState = (): WorkspaceCardSetState => ({
    cardSetId: null,
    cardsLoading: false,
    cards: [],
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