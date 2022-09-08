import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";
import {derived} from "overmind";
import {config} from "../index";

type WorkspaceState = {
    id: number | null;
    readonly workspace: Workspace | null;
}

export const getInitialWorkspaceState = (): WorkspaceState => ({
    id: null,
    workspace: derived((state: WorkspaceState, rootState: typeof config.state) => {
        if (state.id === null) {
            return null;
        }
        const found = rootState.workspaces.list.filter(w => w.id === state.id);
        if (found.length !== 1) {
            return null;
        }
        return found[0];
    })
});

export const state: WorkspaceState = getInitialWorkspaceState();