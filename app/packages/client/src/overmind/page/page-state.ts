import {Pages} from "../../page-urls";
import {Card, CardSet, Workspace, WorkspaceUser} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {CardSetWithCards, CardWithCardSets, WorkspaceWithWorkspaceUsers} from "../data/data-state";

type PageState = {
    page: Pages | null;
    workspaceId: number | null;
    cardSetId: number | null;
    initializing: boolean;
    loadingWorkspaces: boolean;
    loadingCardSets: boolean;
    loadingCards: boolean;
    readonly workspaces: Workspace[];
    readonly workspace: Workspace | null;
    readonly workspaceWithWorkspaceUsers: WorkspaceWithWorkspaceUsers | null;
    readonly workspaceUser: WorkspaceUser | null;
    readonly cardSet: CardSet | null;
    readonly cardSets: CardSet[];
    readonly cardSetWithCards: CardSetWithCards | null;
    readonly cards: Card[];
    readonly cardsWithCardSets: CardWithCardSets[];
}

export const state: PageState = {
    page: null,
    workspaceId: null,
    cardSetId: null,
    initializing: false,
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
        const workspace = state.workspaces.find(w => w.id === state.workspaceId);
        if (workspace === undefined) {
            return null;
        }
        return workspace;
    }),
    workspaceWithWorkspaceUsers: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return null;
        }
        return rootState.data.workspacesWithWorkspaceUsers.find(wwu => wwu.workspace.id === state.workspaceId) ?? null;
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
        const ret = rootState.data.cardSets.find(cs => cs.id === state.cardSetId);
        if (ret === undefined) {
            return null;
        }
        return ret;
    }),
    cardSets: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return [];
        }
        return rootState.data.cardSets.filter(cs => cs.workspaceId === state.workspaceId);
    }),
    cardSetWithCards: derived((state: PageState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }
        return rootState.data.cardSetsWithCards.find(cs => cs.cardSet.id === state.cardSetId) ?? null;
    }),
    cards: derived((state: PageState) => {
        if (state.cardSetId === null) {
            return [];
        }
        return state.cardSetWithCards?.cards ?? [];
    }),
    cardsWithCardSets: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return [];
        }
        return rootState.data.cardsWithCardSets.filter(c => c.cardSets.some(cs => cs.workspaceId === state.workspaceId));
    }),
};