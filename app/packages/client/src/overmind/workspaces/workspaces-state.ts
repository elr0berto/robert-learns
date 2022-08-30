import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";

type WorkspacesState = {
    loadingList: boolean;
    list: Workspace[];
}

export const getInitialWorkspacesState = (): WorkspacesState => ({
    loadingList: false,
    list: [],
});

export const state: WorkspacesState = getInitialWorkspacesState();