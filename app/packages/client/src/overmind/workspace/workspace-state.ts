import {Workspace, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {derived} from "overmind";
import {config} from "..";

type WorkspaceState = {
    workspaceId: number | null;
    cardSetsLoading: boolean;
    cardSets: CardSet[];
    readonly workspace: Workspace | null;
}

export const getInitialWorkspaceState = (): WorkspaceState => ({
    workspaceId: null,
    cardSetsLoading: false,
    cardSets: [],
    workspace: derived((state: WorkspaceState, rootState: typeof config.state) => {
        if (state.workspaceId === null) {
            return null;
        }
        const found = rootState.workspaces.list.filter(w => w.id === state.workspaceId);
        if (found.length !== 1) {
            return null;
        }
        return found[0];
    }),
});

export const state: WorkspaceState = getInitialWorkspaceState();