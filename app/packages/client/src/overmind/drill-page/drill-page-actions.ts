import {Context} from "..";
import {pageUrls} from "../../page-urls";
import {Pages} from "../../page-urls";
export const changeDrill = ({ state }: Context, drillId: string) => {
    if (drillId === 'none' || drillId === 'new') {
        state.drillPage.selectedDrillId = drillId;
        state.drillPage.drillName = '';
        state.drillPage.drillDescription = '';
        state.drillPage.selectedCardSetIds = [];
    } else {
        state.drillPage.selectedDrillId = parseInt(drillId);
        const drillWithCardSets = state.drillPage.selectedDrillWithDrillCardSets;
        if (!drillWithCardSets) {
            throw new Error('DrillWithCardSets with drillId ' + drillId + ' not found.');
        }

        state.drillPage.drillName = drillWithCardSets.drill.name;
        state.drillPage.drillDescription = drillWithCardSets.drill.description;
        state.drillPage.selectedCardSetIds = drillWithCardSets.drillCardSets.map(dcs => dcs.cardSetId);
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

export const saveDrill = async ({ state, effects, actions }: Context, {run, resume} : {run: boolean, resume?: boolean}) => {
    console.log('saveDrill');
    if (!resume) {
        state.drillPage.possibleResumeDrillRunId = null;
    }
    state.drillPage.saveAttempted = true;
    if (!state.drillPage.isValid) {
        return;
    }

    if (state.drillPage.selectedDrillId === 'none') {
        throw new Error('Invalid drill id');
    }

    state.drillPage.saving = true;

    // check if there is an unfinished drill run for this drill that we can resume
    if (run && state.drillPage.selectedDrillId !== 'new' && resume === undefined) {
        console.log('1');
        const uResp = await effects.api.drillRuns.getLatestUnfinishedDrillRun({drillId: state.drillPage.selectedDrillId});

        if (uResp.drillRun !== null && uResp.drill !== null && uResp.drillRunQuestions !== null) {
            console.log('2');
            actions.data.addOrUpdateDrills([uResp.drill]);
            actions.data.addOrUpdateDrillRuns([uResp.drillRun]);
            actions.data.addOrUpdateDrillRunQuestions(uResp.drillRunQuestions);
            state.drillPage.possibleResumeDrillRunId = uResp.drillRun.id;

            console.log('state.drillPage.possibleResumeDrillRunId', state.drillPage.possibleResumeDrillRunId);
            if (state.drillPage.possibleResumeDrillRunWithNumbers !== null) {
                state.drillPage.saving = false;
                return;
            }
        }
    }

    const resp = await effects.api.drills.createDrill({
        drillId: state.drillPage.selectedDrillId === 'new' ? null : state.drillPage.selectedDrillId,
        name: state.drillPage.drillName,
        description: state.drillPage.drillDescription,
        cardSetIds: state.drillPage.selectedCardSetIds,
    });

    if (resp.drill === null) {
        throw new Error('Drill missing from response.');
    }
    if (resp.drillCardSets === null) {
        throw new Error('Drill card sets missing from response.');
    }

    actions.data.addOrUpdateDrills([resp.drill]);
    actions.data.addOrUpdateDrillCardSetsForDrillId({drillId: resp.drill.id, drillCardSets: resp.drillCardSets});

    state.drillPage.selectedDrillId = resp.drill.id;

    if (run) {
        if (resume) {
            if (state.drillPage.possibleResumeDrillRunWithNumbers === null) {
                throw new Error('No drill run to resume');
            }
            effects.page.router.goTo(pageUrls[Pages.DrillRun].url(resp.drill, state.drillPage.possibleResumeDrillRunWithNumbers.drillRun));
        } else {
            // create a new drill run and open the drill run page with the new drill run
            const drResp = await effects.api.drillRuns.createDrillRun({drillId: resp.drill.id});
            if (drResp.drillRun === null) {
                throw new Error('DrillRun missing from response.');
            }
            actions.data.addOrUpdateDrillRuns([drResp.drillRun]);
            effects.page.router.goTo(pageUrls[Pages.DrillRun].url(resp.drill, drResp.drillRun));
        }
    } else {
        state.notifications.notifications.push({
            message: 'Drill saved successfully'
        });
    }

    state.drillPage.saving = false;
}

export const runDrill = async ({ state, effects, actions }: Context) => {
    console.log('runDrill');
    actions.drillPage.saveDrill({run: true});
}

export const closeResumeDrillModal = ({ state }: Context) => {
    console.log('closeResumeDrillModal');
    state.drillPage.possibleResumeDrillRunId = null;
}