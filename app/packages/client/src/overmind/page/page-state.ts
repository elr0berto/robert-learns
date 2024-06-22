import {Pages} from "../../page-urls";
import {
    Card,
    CardSet,
    Drill,
    Workspace,
    WorkspaceUser
} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "../index";
import {
    CardSetWithCardsWithCardSets, CardSetWithChildren,
    CardWithCardSets, DrillWithDrillCardSets, WorkspaceWithCardSets,
    WorkspaceWithCardSetsCount, WorkspaceWithCardSetsWithChildren, WorkspaceWithCardSetsWithChildrenIds,
    WorkspaceWithWorkspaceUsers
} from "../data/data-state";

type PageState = {
    page: Pages | null;
    workspaceId: number | null;
    cardSetId: number | null;
    drillRunId: number | null;
    initializing: boolean;
    loadingWorkspaces: boolean;
    loadingCardSets: boolean;
    loadingCards: boolean;
    loadingDrills: boolean;
    loadingDrillRuns: boolean;
    readonly workspaces: Workspace[];
    readonly workspacesWithCardSetsCounts: WorkspaceWithCardSetsCount[];
    readonly workspacesWithCardSets: WorkspaceWithCardSets[];
    readonly workspacesWithCardSetsWithChildren: WorkspaceWithCardSetsWithChildren[];
    readonly workspacesWithCardSetsWithChildrenIds: WorkspaceWithCardSetsWithChildrenIds[];
    readonly workspace: Workspace | null;
    readonly workspaceWithWorkspaceUsers: WorkspaceWithWorkspaceUsers | null;
    readonly workspaceUser: WorkspaceUser | null;
    readonly cardSet: CardSet | null;
    readonly cardSetWithChildren: CardSetWithChildren | null;
    readonly cardSets: CardSet[];
    readonly cardSetsWithChildren: CardSetWithChildren[];
    readonly flatCardSetsWithChildren: CardSetWithChildren[];
    readonly cardSetWithCardsWithCardSets: CardSetWithCardsWithCardSets | null;
    readonly cards: Card[];
    readonly cardsWithCardSets: CardWithCardSets[];
    readonly drills: Drill[];
    readonly drillsWithDrillCardSets: DrillWithDrillCardSets[];
}

export const state: PageState = {
    page: null,
    workspaceId: null,
    cardSetId: null,
    drillRunId: null,
    initializing: false,
    loadingWorkspaces: false,
    loadingCardSets: false,
    loadingCards: false,
    loadingDrills: false,
    loadingDrillRuns: false,
    workspaces: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.workspaces.filter(workspace => {
            return workspace.allowGuests || rootState.data.workspaceUsers.some(wu => wu.workspaceId === workspace.id && wu.userId === rootState.signIn.userId);
        });
    }),
    workspacesWithCardSetsCounts: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.workspacesWithCardSetsCounts.filter(wwc => {
            return wwc.workspace.allowGuests || rootState.data.workspaceUsers.some(wu => wu.workspaceId === wwc.workspace.id && wu.userId === rootState.signIn.userId);
        });
    }),
    workspacesWithCardSets: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.workspacesWithCardSets.filter(wwc => {
            return wwc.workspace.allowGuests || rootState.data.workspaceUsers.some(wu => wu.workspaceId === wwc.workspace.id && wu.userId === rootState.signIn.userId);
        });
    }),
    workspacesWithCardSetsWithChildren: derived((state: PageState, rootState: typeof config.state) => {
        console.log('page-state workspacesWithCardSetsWithChildren rootState.data.workspacesWithCardSetsWithChildren', rootState.data.workspacesWithCardSetsWithChildren);
        return rootState.data.workspacesWithCardSetsWithChildren.filter(wwc => {
            return wwc.workspace.allowGuests || rootState.data.workspaceUsers.some(wu => wu.workspaceId === wwc.workspace.id && wu.userId === rootState.signIn.userId);
        });
    }),
    workspacesWithCardSetsWithChildrenIds: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.workspacesWithCardSetsWithChildrenIds.filter(wwc => {
            return wwc.workspace.allowGuests || rootState.data.workspaceUsers.some(wu => wu.workspaceId === wwc.workspace.id && wu.userId === rootState.signIn.userId);
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
    cardSetWithChildren: derived((state: PageState) => {
        if (state.cardSet === null) {
            return null;
        }

        const cardSetWithChildren = state.flatCardSetsWithChildren.find(cs => cs.cardSet.id === state.cardSetId);
        if (cardSetWithChildren === undefined) {
            throw new Error('CardSetWithChildren with cardSetId ' + state.cardSetId + ' not found.');
        }
        return cardSetWithChildren;
    }),
    flatCardSetsWithChildren: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return [];
        }
        return rootState.data.flatCardSetsWithChildren.filter(cs => cs.cardSet.workspaceId === state.workspaceId);
    }),
    cardSets: derived((state: PageState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return [];
        }
        return rootState.data.cardSets.filter(cs => cs.workspaceId === state.workspaceId);
    }),
    cardSetsWithChildren: derived((state: PageState, rootState: typeof config.state) => {
        console.log('page-state cardSetsWithChildren rootState.data.cardSetsWithChildren', rootState.data.cardSetsWithChildren);
        return rootState.data.cardSetsWithChildren.filter(cs => cs.cardSet.workspaceId === state.workspaceId);
    }),
    cardSetWithCardsWithCardSets: derived((state: PageState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }
        return rootState.data.cardSetsWithCardsWithCardSets.find(cs => cs.cardSet.id === state.cardSetId) ?? null;
    }),
    cards: derived((state: PageState) => {
        if (state.cardSetId === null) {
            return [];
        }
        return state.cardsWithCardSets.map(c => c.card);
    }),
    cardsWithCardSets: derived((state: PageState) => {
        if (state.cardSetId === null) {
            return [];
        }
        return state.cardSetWithCardsWithCardSets?.cardsWithCardSets ?? [];
    }),
    drills: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.drills;
    }),
    drillsWithDrillCardSets: derived((state: PageState, rootState: typeof config.state) => {
        return rootState.data.drillsWithDrillCardSets;
    }),
};