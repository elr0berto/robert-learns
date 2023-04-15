import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form} from "react-bootstrap";
import React from "react";

function WorkspaceCardSetCreatePage() {
    const state = useAppState();
    const actions = useActions();

    if (state.signIn.user!.isGuest) {
        return <Container className="my-5"><Alert variant="danger">Only signed in users are allowed to create card sets</Alert></Container>;
    }

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
            <Form.Group className="mb-3" controlId="cardSetDescription">
                <Form.Label>Card Set Description</Form.Label>
                <Form.Control type="text" placeholder="Please provide a short description for your card set" value={state.workspaceCardSetCreate.form.description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceCardSetCreate.changeFormDescription(event.currentTarget.value)}/>
            </Form.Group>
            {state.workspaceCardSetCreate.form.showErrors ? <Alert variant="danger">{state.workspaceCardSetCreate.form.allErrors.map((err: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, i: React.Key | null | undefined) => <p key={i}>{err}</p>)}</Alert> : null}
            <Button disabled={state.workspaceCardSetCreate.form.submitDisabled} onClick={() => actions.workspaceCardSetCreate.formSubmit()}>Create Card Set!</Button>
        </Form>
    </Container>;
}

export default WorkspaceCardSetCreatePage;