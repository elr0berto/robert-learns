import {derived} from 'overmind'

type WorkspacesState = {
    loading: boolean;
}

export const getInitialWorkspacesState = (): WorkspacesState => ({
    loading: false,
});

export const state: WorkspacesState = getInitialWorkspacesState();