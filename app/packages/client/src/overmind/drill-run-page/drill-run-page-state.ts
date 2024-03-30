import {derived} from "overmind";
import {Card, Drill, DrillRun, DrillRunQuestion} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type DrillRunPageState = {
    readonly drill: Drill | null;
    readonly drillRun: DrillRun | null;
    readonly questions: DrillRunQuestion[];
    readonly completed: boolean;
    readonly currentQuestion: DrillRunQuestion | null;
    readonly currentCard: Card | null;
    readonly content: string | null;
    readonly contentEmpty: boolean;
    readonly twoSided: boolean;
    readonly hasAudio: boolean;
    readonly audioSrc: string | null;
    readonly progress: number;
    readonly progressRights: number;
    readonly progressWrongs: number;
    readonly progressTotal: number;
    side: 'front' | 'back';
}

export const getInitialDrillRunPageState = () : DrillRunPageState => {
    return {
        drill: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (!state.drillRun) {
                return null;
            }

            return rootState.data.drills.find(d => d.id === state.drillRun?.drillId) ?? null;
        }),
        drillRun: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (rootState.page.drillRunId === null) {
                return null;
            }

            return rootState.data.drillRuns.find(dr => dr.id === rootState.page.drillRunId) ?? null;
        }),
        questions: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (rootState.page.drillRunId === null) {
                return [];
            }

            return rootState.data.drillRunQuestions.filter(drq => drq.drillRunId === rootState.page.drillRunId);
        }),
        completed: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.drillRun === null) {
                return false;
            }

            return state.questions.find(q => q.correct === null) === undefined;
        }),
        currentQuestion: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.drillRun === null) {
                return null;
            }

            return state.questions.find(q => q.correct === null) ?? null;
        }),
        currentCard: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.currentQuestion === null) {
                return null;
            }

            return rootState.data.cards.find(c => c.id === state.currentQuestion?.cardId) ?? null;
        }),
        content: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.currentCard === null) {
                return null;
            }

            return state.side === 'front' ? state.currentCard.front.content : state.currentCard.back.content;
        }),
        contentEmpty: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            return state.content === null || state.content.trim().length === 0;
        }),
        twoSided: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.currentCard === null) {
                return false;
            }

            return (state.currentCard?.back?.content?.trim().length ?? 0) > 0;
        }),
        hasAudio: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.currentCard === null) {
                return false;
            }

            return state.currentCard.audio !== null;
        }),
        audioSrc: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            return state.currentCard?.audio?.getUrl() ?? null;
        }),
        progress: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            if (state.currentQuestion === null) {
                return 0;
            }

            return state.questions.filter(q => q.correct !== null).length;
        }),
        progressRights: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            return state.questions.filter(q => q.correct === true).length;
        }),
        progressWrongs: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            return state.questions.filter(q => q.correct === false).length;
        }),
        progressTotal: derived((state: DrillRunPageState, rootState: typeof config.state) => {
            return state.questions.length;
        }),
        side: 'front',
    };
}

export const state: DrillRunPageState = getInitialDrillRunPageState();