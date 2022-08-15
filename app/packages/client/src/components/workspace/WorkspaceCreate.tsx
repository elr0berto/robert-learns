import {Alert, Button, Container, Form} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";

function WorkspaceCreate() {
    const state = useAppState();
    const actions = useActions();

    return <Container>
        <h1 className="my-5">Create a workspace</h1>
        <Form className="col-lg-5">
        <Form.Group className="mb-3" controlId="workspaceName">
            <Form.Label>Workspace Name</Form.Label>
            <Form.Control type="text" placeholder="Enter workspace name" value={state.workspaces.createForm.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaces.changeCreateFormName(event.currentTarget.value)}/>
        </Form.Group>
        {state.workspaces.createForm.showErrors ? <Alert variant="danger">{state.workspaces.createForm.allErrors.map((err,i) => <p key={i}>{err}</p>)}</Alert> : null}
        <Button disabled={state.workspaces.createForm.submitDisabled} onClick={() => actions.workspaces.createFormSubmit()}>Create Workspace!</Button>
    </Form>;
    </Container>;
}

export default WorkspaceCreate;