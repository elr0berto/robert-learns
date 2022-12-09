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
        console.log('workspace derived', state.workspaceId);
        if (state.workspaceId === null) {
            console.log('workspace derived returned null', state.workspaceId);
            return null;
        }
        const found = rootState.workspaces.list.filter(w => w.id === state.workspaceId);
        console.log('workspace derived found', found);
        if (found.length !== 1) {
            return null;
        }
        return found[0];
    }),
});

export const state: WorkspaceState = getInitialWorkspaceState();