import {Pages} from "../../page-urls";
import {Card, CardSet, Workspace, WorkspaceUser} from "@elr0berto/robert-learns-shared/dist/api/models";
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
    readonly workspaces: Workspace[];
    readonly workspace: Workspace | null;
    readonly workspaceUser: WorkspaceUser | null;
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
    workspaces: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.workspaces.filter(workspace => {
            return workspace.allowGuests || rootState.data.workspaceUsers.some(wu => wu.workspaceId === workspace.id && wu.userId === rootState.signIn.userId);
        });
    }),
    workspace: derived((state: PageState) => {
        if (state.workspaceId === null) {
            return null;
        }
        return state.workspaces.find(w => w.id === state.workspaceId)!;
    }),
    workspaceUser: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return null;
        }
        if (rootState.signIn.userId === null) {
            return null;
        }
        return rootState.data.workspaceUsers.find(wu => wu.workspaceId === state.workspaceId && wu.userId === rootState.signIn.userId) ?? null;
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