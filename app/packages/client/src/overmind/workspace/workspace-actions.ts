import { Context } from '..';

export const _loadCardSets = async ({ state, effects, actions }: Context) => {
    state.workspace.cardSetsLoading = true;
    console.log('_loadCardSets', state.workspace.workspace);
    const resp = await effects.api.cardSets.getCardSets({ workspaceId: state.workspace.workspace!.id });
    state.workspace.cardSets = resp.cardSets;
    state.workspace.cardSetsLoading = false;
}