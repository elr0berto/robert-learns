import React from 'react';
import ReactDOM from 'react-dom/client';
import './sass/style.scss';
import App from './App';
import { createOvermind } from 'overmind';
import { config } from './overmind';
import {Provider} from "overmind-react";

import 'bootstrap/dist/css/bootstrap.min.css';
import {UnexpectedSignOutError} from "./overmind/sign-in/sign-in-state";

export const overmind = createOvermind(config, {
    devtools: process.env.REACT_APP_OVERMIND_DEVTOOLS === 'true',
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
    overmind.actions.error.setError({error: new Error(e.reason.stack), errorInfo: null});
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
      <Provider value={overmind}>
          <App />
      </Provider>
  </React.StrictMode>
);
