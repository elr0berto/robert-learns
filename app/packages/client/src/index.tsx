import React from 'react';
import ReactDOM from 'react-dom';
import './sass/style.scss';
import App from './App';
import { createOvermind } from 'overmind';
import { config } from './overmind';

console.log('x1');
export const overmind = createOvermind(config, {
    devtools: process.env.REACT_APP_OVERMIND_DEVTOOLS === 'true',
});
console.log('x2', document.getElementById('root'));
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
console.log('x3', document.getElementById('root'));
