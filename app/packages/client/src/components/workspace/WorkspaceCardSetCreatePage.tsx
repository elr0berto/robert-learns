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
                <Form.Control type="text" placeholder="Enter card set name" value={state.workspaceCardSetCreate.form.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceCardSetCreate.changeFormName(event.currentTarget.value)}/>
            </Form.Group>
            {state.workspaceCardSetCreate.form.showErrors ? <Alert variant="danger">{state.workspaceCardSetCreate.form.allErrors.map((err,i) => <p key={i}>{err}</p>)}</Alert> : null}
            <Button disabled={state.workspaceCardSetCreate.form.submitDisabled} onClick={() => actions.workspaceCardSetCreate.formSubmit()}>Create Card Set!</Button>
        </Form>
    </Container>;
}

export default WorkspaceCardSetCreatePage;