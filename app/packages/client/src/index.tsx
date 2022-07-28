import React from 'react';
import ReactDOM from 'react-dom';
import './sass/style.scss';
import App from './App';
import { createOvermind } from 'overmind';
import { config } from './overmind';
import {Provider} from "overmind-react";

import 'bootstrap/dist/css/bootstrap.min.css';

export const overmind = createOvermind(config, {
    devtools: process.env.REACT_APP_OVERMIND_DEVTOOLS === 'true',
});

ReactDOM.render(
  <React.StrictMode>
      <Provider value={overmind}>
        <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
