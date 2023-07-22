import { Context } from '..';

export const loadMore = async ({state, effects}: Context) => {
    state.adminLogsPage.loading = true;
    const resp = await effects.api.logs.getLogEntries({fromId: state.adminLogsPage.nextFromId});
    if (resp.logEntries === null) {
        throw new Error('Unexpected null logEntries');
    }
    if (resp.logEntries.length > 0) {
        state.adminLogsPage.logEntries.push(...resp.logEntries);
    }

    state.adminLogsPage.loading = false;
}