import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";

type WorkspacesState = {
    loading: boolean;
    list: Workspace[];
}

export const getInitialWorkspacesState = (): WorkspacesState => ({
    loading: false,
    list: [],
});

export const state: WorkspacesState = getInitialWorkspacesState();