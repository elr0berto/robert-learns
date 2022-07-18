import React, { useState } from 'react';
import {useAppState} from "./overmind";
import {LoginStatus} from "./overmind/login/login-state";

function App() {
    const state = useAppState();

    if (state.login.status === LoginStatus.Checking) {
        return <div>Loading...</div>;
    }

    return (
    <div className="App">
        <div>Logged in as {state.login.user!.firstName}</div>
    </div>
  );
}

export default App;
