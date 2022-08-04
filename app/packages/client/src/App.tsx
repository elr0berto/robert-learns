import React from 'react';
import {useActions, useAppState} from "./overmind";
import ErrorBoundary from "./components/error/ErrorBoundary";
import AppInner from "./AppInner";

function App() {
    const state = useAppState();
    const actions = useActions();

    return <ErrorBoundary errorActions={actions.error} errorState={state.error}>
        <AppInner/>
    </ErrorBoundary>
}

export default App;
