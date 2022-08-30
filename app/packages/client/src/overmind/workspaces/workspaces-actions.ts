import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models/BaseResponse";

export const getWorkspaceList = async ({state,effects} : Context) => {
    state.workspaces.loadingList = true;

    const resp = await effects.api.workspaces.workspaceList();

    state.workspaces.list = resp.list;

    state.workspaces.loadingList = false;
}