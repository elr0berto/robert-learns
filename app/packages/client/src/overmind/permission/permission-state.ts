import {Workspace, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "..";

type PermissionState = {
    workspaceId: number | null;
    cardSetId: number | null;
    loadingWorkspaces: boolean;
    loadingCardSets: boolean;
    readonly workspace: Workspace | null;
    readonly cardSet: CardSet | null;
}

export const getInitialPermissionState = (): PermissionState => ({
    workspaceId: null,
    cardSetId: null,
    loadingWorkspaces: false,
    loadingCardSets: false,
    workspace: derived((state: NavState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return null;
        }
        return rootState.data.workspaces.find(w => w.id === state.workspaceId)!;
    }),
    cardSet: derived((state: NavState, rootState: typeof config.state) => {
        if (state.cardSetId === null) {
            return null;
        }
        return rootState.data.cardSets.find(cs => cs.id === state.cardSetId)!;
    }),
});

export const state: PermissionState = getInitialPermissionState();