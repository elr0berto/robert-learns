import { Context } from '..';

export const getWorkspaceList = async ({state,effects} : Context) => {
    state.workspaces.loading = true;

    const resp = await effects.api.workspaces.getWorkspaces();

    state.workspaces.list = resp.workspaces!;

    state.workspaces.loading = false;
}