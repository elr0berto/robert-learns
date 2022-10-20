import { Context } from '..';
import {Pages} from "../../page-urls";
import {Payload} from "../page/page-actions";

export const _loadCardSets = async ({ state, effects, actions }: Context) => {
    state.workspace.cardSetsLoading = true;
    console.log('_loadCardSets', state.workspace.workspace);
    const resp = await effects.api.workspaces.workspaceCardSetList(state.workspace.workspace!);
    state.workspace.cardSets = resp.cardSets;
    state.workspace.cardSetsLoading = false;
}