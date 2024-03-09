import {derived} from "overmind";
import {Card, Drill, DrillRun} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type DrillRunPageState = {
    readonly drill: Drill | null;
    readonly drillRun: DrillRun | null;
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
    };
}

export const state: DrillRunPageState = getInitialDrillRunPageState();