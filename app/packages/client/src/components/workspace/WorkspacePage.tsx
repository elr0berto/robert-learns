import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form} from "react-bootstrap";
import React from "react";

function WorkspacePage() {
    const state = useAppState();
    const actions = useActions();

    if (state.workspace.workspace === null) {
        if (state.workspaces.loading) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }
    return <Container>
        <h1 className="my-5">Workspace {state.workspace.workspace.name}</h1>
    </Container>;
}

export default WorkspacePage;