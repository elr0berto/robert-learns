import {Pages} from "../../page-urls";
import {Card, CardSet, Workspace} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {CardSetWithCards} from "../data/data-state";

type PageState = {
    page: Pages | null;
    workspaceId: number | null;
    cardSetId: number | null;
    loadingWorkspaces: boolean;
    loadingCardSets: boolean;
    loadingCards: boolean;
    readonly workspace: Workspace | null;
    readonly cardSet: CardSet | null;
    readonly cardSetWithCards: CardSetWithCards | null;
    readonly cardSetsInCurrentWorkspace: CardSet[];
    readonly cardsInCurrentCardSet: Card[];
}

export const state: PageState = {
    page: null,
    workspaceId: null,
    cardSetId: null,
    loadingWorkspaces: true,
    loadingCardSets: true,
    loadingCards: true,
    workspace: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return null;
        }
        return rootState.data.workspaces.find(w => w.id === state.workspaceId)!;
    }),
    cardSet: derived((state: PageState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }
        return rootState.data.cardSets.find(cs => cs.id === state.cardSetId)!;
    }),
    cardSetWithCards: derived((state: PageState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }
        return rootState.data.cardSetsWithCards.find(cs => cs.cardSet.id === state.cardSetId) ?? null;
    }),
    cardSetsInCurrentWorkspace: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return [];
        }
        return rootState.data.cardSets.filter(cs => cs.workspaceId === state.workspaceId);
    }),
    cardsInCurrentCardSet: derived((state: PageState) => {
        if (state.cardSetId === null) {
            return [];
        }
        return state.cardSetWithCards?.cards ?? [];
    }),
};