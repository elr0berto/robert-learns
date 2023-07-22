import {derived} from 'overmind'
import {LogEntry} from "@elr0berto/robert-learns-shared/dist/api/models";


type AdminLogsPageState = {
    loading: boolean;
    logEntries: LogEntry[];
    readonly nextFromId: number | null;
}

export const getInitialAdminLogsPageState = () : AdminLogsPageState => ({
    loading: false,
    logEntries: [],
    nextFromId: derived((state: AdminLogsPageState) => {
        if (state.logEntries.length === 0) {
            return null;
        }
        return state.logEntries[state.logEntries.length - 1].id;
    }),
});

export const state: AdminLogsPageState = getInitialAdminLogsPageState();