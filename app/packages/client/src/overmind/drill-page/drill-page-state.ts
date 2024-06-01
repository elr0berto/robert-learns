import {derived} from "overmind";
import {config} from "../index";
import {DrillWithDrillCardSets} from "../data/data-state";
import {DrillRun} from "@elr0berto/robert-learns-shared/dist/api/models";

type DrillRunWithNumbers = {
    drillRun: DrillRun;
    answeredCount: number;
    questionCount: number;
}

type DrillPageState = {
    selectedDrillId: number | 'none' | 'new';
    drillName: string;
    drillDescription: string;
    selectedCardSetIds: number[];
    saveAttempted: boolean;
    saving: boolean;
    possibleResumeDrillRunId: number | null;
    readonly selectedWorkspaceIds: number[];
    readonly indeterminateWorkspaceIds: number[];
    readonly isValid: boolean;
    readonly errorMessage: string | null;
    readonly formDisabled: boolean;
    readonly selectedDrillWithDrillCardSets: DrillWithDrillCardSets | null;
    readonly selectedDrillCardSetIds: number[];
    readonly selectedCardSetsChanged: boolean;
    readonly possibleResumeDrillRunWithNumbers: DrillRunWithNumbers | null;
}

export const getInitialDrillPageState = () : DrillPageState => {
    return {
        selectedDrillId: 'none',
        drillName: '',
        drillDescription: '',
        selectedCardSetIds: [],
        saveAttempted: false,
        saving: false,
        possibleResumeDrillRunId: null,
        selectedWorkspaceIds: derived((state: DrillPageState, rootState: typeof config.state) => {
            const workspaces = rootState.page.workspacesWithCardSets.filter(w => w.cardSets.length > 0);
            let ret : number[] = [];

            workspaces.forEach(w => {
                const cardSetIds = w.cardSets.map(cs => cs.id);
                if (cardSetIds.every(csid => state.selectedCardSetIds.includes(csid))) {
                    ret.push(w.workspace.id);
                }
            });

            return ret;
        }),
        indeterminateWorkspaceIds: derived((state: DrillPageState, rootState: typeof config.state) => {
            const workspaces = rootState.page.workspacesWithCardSets.filter(w => w.cardSets.length > 0);
            let ret: number[] = [];

            workspaces.forEach(w => {
                const cardSetIds = w.cardSets.map(cs => cs.id);
                const selectedCount = cardSetIds.filter(csid => state.selectedCardSetIds.includes(csid)).length;

                // Check if at least one, but not all card sets are selected
                if (selectedCount > 0 && selectedCount < cardSetIds.length) {
                    ret.push(w.workspace.id);
                }
            });

            return ret;
        }),
        isValid: derived((state: DrillPageState) => {
            return state.drillName.trim().length > 0 && state.drillDescription.trim().length > 0 && state.selectedCardSetIds.length > 0;
        }),
        errorMessage: derived((state: DrillPageState) => {
            if (state.drillName.trim().length === 0) {
                return 'Please enter a name for the drill.';
            }
            if (state.drillDescription.trim().length === 0) {
                return 'Please provide a description.';
            }
            if (state.selectedCardSetIds.length === 0) {
                return 'Please select at least one card set.';
            }

            return null;
        }),
        formDisabled: derived((state: DrillPageState) => {
            return state.saving;
        }),
        selectedDrillWithDrillCardSets: derived((state: DrillPageState, rootState: typeof config.state) => {
            if (state.selectedDrillId === 'new' || state.selectedDrillId === 'none') {
                return null;
            }
            const drillWithCardSets = rootState.page.drillsWithDrillCardSets.find(d => d.drill.id === state.selectedDrillId);
            if (!drillWithCardSets) {
                throw new Error('DrillWithCardSets with drillId ' + state.selectedDrillId + ' not found.');
            }
            return drillWithCardSets;
        }),
        selectedDrillCardSetIds: derived((state: DrillPageState) => {
            return state.selectedDrillWithDrillCardSets?.drillCardSets.map(dcs => dcs.cardSetId) ?? [];
        }),
        selectedCardSetsChanged: derived((state: DrillPageState) => {
            if (state.selectedDrillWithDrillCardSets === null) {
                return false;
            }
            if (state.selectedCardSetIds.length === state.selectedDrillWithDrillCardSets.drillCardSets.length) {
                return false;
            }

            // check that all the state.selectedCardSetIds exist in state.selectedDrillCardSetIds
            return !state.selectedCardSetIds.every(csid => state.selectedDrillCardSetIds.includes(csid));
        }),
        possibleResumeDrillRunWithNumbers: derived((state: DrillPageState, rootState: typeof config.state) => {
            console.log('a');
            if (state.possibleResumeDrillRunId === null || state.selectedCardSetsChanged) {
                console.log('b');
                console.log('state.possibleResumeDrillRunId', state.possibleResumeDrillRunId);
                console.log('state.selectedCardSetsChanged', state.selectedCardSetsChanged);
                return null;
            }
            console.log('c');
            const drillRun = rootState.data.drillRuns.find(dr => dr.id === state.possibleResumeDrillRunId);
            if (!drillRun) {
                throw new Error('DrillRun with id ' + state.possibleResumeDrillRunId + ' not found.');
            }
            // questions
            const questions = rootState.data.drillRunQuestions.filter(drq => drq.drillRunId === drillRun.id);
            if (questions.length === 0) {
                throw new Error('No questions found for drill run with id ' + drillRun.id);
            }
            const answeredCount = questions.filter(q => q.correct !== null).length;
            return {
                drillRun: drillRun,
                answeredCount: answeredCount,
                questionCount: questions.length
            };
        })
    };
}

export const state: DrillPageState = getInitialDrillPageState();