import {Context} from "..";

export const changeDrill = ({ state }: Context, drillId: string) => {
    if (drillId === 'none' || drillId === 'new') {
        state.drillPage.selectedDrillId = drillId;
    } else {
        state.drillPage.selectedDrillId = parseInt(drillId);
    }
}

export const changeDrillName = ({ state }: Context, name: string) => {
    state.drillPage.drillName = name;
}

export const changeDrillDescription = ({ state }: Context, description: string) => {
    state.drillPage.drillDescription = description;
}

export const toggleWorkspaceId = ({ state }: Context, workspaceId: number) => {
    // get the workspace from state.page.workspacesWithCardSets
    const workspaceWithCardSets = state.page.workspacesWithCardSets.find(w => w.workspace.id === workspaceId);
    if (!workspaceWithCardSets) {
        throw new Error('Workspace with id ' + workspaceId + ' not found.');
    }
    const cardSetIds = workspaceWithCardSets.cardSets.map(cs => cs.id);

    // check if workspaceId is in indeterminate state, if so, remove all cardsets
    const indeterminate = state.drillPage.indeterminateWorkspaceIds.includes(workspaceId);
    const checked = state.drillPage.selectedWorkspaceIds.includes(workspaceId);

    if (!checked && !indeterminate) {
        // add the cardSetIds to state.drillPage.selectedCardSetIds if they dont exist in the array yet
        state.drillPage.selectedCardSetIds = state.drillPage.selectedCardSetIds.concat(cardSetIds.filter(item => !state.drillPage.selectedCardSetIds.includes(item)));
    } else {
        state.drillPage.selectedCardSetIds = state.drillPage.selectedCardSetIds.filter(item => !cardSetIds.includes(item));
    }
}

export const toggleCardSetId = ({ state }: Context, cardSetId: number) => {
    const index = state.drillPage.selectedCardSetIds.indexOf(cardSetId);
    if (index === -1) {
        state.drillPage.selectedCardSetIds.push(cardSetId);
    } else {
        state.drillPage.selectedCardSetIds.splice(index, 1);
    }
}

export const saveDrill = async ({ state, effects, actions }: Context) => {
    state.drillPage.saveAttempted = true;
    if (!state.drillPage.isValid) {
        return;
    }

    if (state.drillPage.selectedDrillId === 'none') {
        throw new Error('Invalid drill id');
    }

    state.drillPage.saving = true;
    const resp = await effects.api.drills.createDrill({
        drillId: state.drillPage.selectedDrillId === 'new' ? null : state.drillPage.selectedDrillId,
        name: state.drillPage.drillName,
        description: state.drillPage.drillDescription,
        cardSetIds: state.drillPage.selectedCardSetIds,
    });

    if (resp.drill === null) {
        throw new Error('Drill missing from response.');
    }

    actions.data.addOrUpdateDrill(resp.drill);
    state.drillPage.selectedDrillId = resp.drill.id;

    state.drillPage.saving = false;
}

export const runDrill = async ({ state, effects }: Context) => {
    state.drillPage.saveAttempted = true;
    if (!state.drillPage.isValid) {
        return;
    }

    state.drillPage.saving = true;

}