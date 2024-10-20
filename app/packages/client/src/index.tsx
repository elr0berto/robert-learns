import React from 'react';
import { createOvermind } from 'overmind';
import {config} from './overmind';
import {Provider} from "overmind-react";
import {createRoot} from "react-dom/client";

import App from "./components/App";
import {UnexpectedSignOutError} from "./overmind/sign-in/sign-in-state";

import './sass/style.scss';
import 'quill/dist/quill.snow.css'; // Add css for snow theme


declare global {
    interface Window {
        audioFile?: File | null;
        //FB: any;
    }
}

window.audioFile = null;

export const overmind = createOvermind(config, {
    devtools: true /*process.env.REACT_APP_OVERMIND_DEVTOOLS === 'true',*/
});

window.onerror = (msg, url, line, col, error) => {
    console.log('on error', {msg, url, line, col, error});
    overmind.actions.error.setError({error: typeof error === 'undefined' ? new Error(typeof msg === 'string' ? msg : msg.type) : error, errorInfo: null});
};

window.onunhandledrejection = (e: PromiseRejectionEvent) => {
    console.log('onunhandledrejection', e);
    console.error(e);
    if (e?.reason === UnexpectedSignOutError) { // ignore.. this is just thrown to interrupt the flow when user is logged out,.
        return;
    }
    const error = e.reason instanceof Error
        ? e.reason
        : new Error(String(e.reason));
    console.error('onunhandledrejection error', error);
    overmind.actions.error.setError({error: error, errorInfo: null});
}
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <Provider value={overmind}>
        <App />
    </Provider>
);
