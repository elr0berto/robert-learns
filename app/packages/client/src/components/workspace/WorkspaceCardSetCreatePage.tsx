import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form} from "react-bootstrap";
import React from "react";

function WorkspaceCardSetCreatePage() {
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
        <h1 className="my-5">Create card set in workspace {state.workspace.workspace.name}</h1>
        <Form className="col-lg-5">
            <Form.Group className="mb-3" controlId="cardSetName">
                <Form.Label>Card Set Name</Form.Label>
                <Form.Control type="text" placeholder="Enter card set name" value={state.workspaceCreate.form.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceCreate.changeFormName(event.currentTarget.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="workspaceDescription">
                <Form.Label>Workspace Description</Form.Label>
                <Form.Control type="text" placeholder="Please provide a short description for your workspace" value={state.workspaceCreate.form.description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceCreate.changeFormDescription(event.currentTarget.value)}/>
            </Form.Group>
            {state.workspaceCreate.form.showErrors ? <Alert variant="danger">{state.workspaceCreate.form.allErrors.map((err,i) => <p key={i}>{err}</p>)}</Alert> : null}
            <Button disabled={state.workspaceCreate.form.submitDisabled} onClick={() => actions.workspaceCreate.formSubmit()}>Create Workspace!</Button>
        </Form>
    </Container>;
}

export default WorkspaceCardSetCreatePage;