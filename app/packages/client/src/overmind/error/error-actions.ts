import { Context } from '..';
import {ErrorInfo} from "react";

export const setError = async ({ state, effects }: Context, {error, errorInfo}: {error: Error, errorInfo: ErrorInfo|null}) => {
    try {
        state.error.error = error;
        state.error.errorInfo = errorInfo;

        //effects.analytics.DtvGA('my-pages-error', 'my-pages-set-error');

        //await effects.log.logError({error: error, errorInfo: errorInfo ?? undefined});

    } catch {}
};

export const reloadPage = ({ state, effects }: Context) => {
    state.error.reloadingPage = true;
    effects.page.reloadPage();
}