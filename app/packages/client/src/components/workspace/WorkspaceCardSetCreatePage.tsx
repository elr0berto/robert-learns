import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form} from "react-bootstrap";
import React from "react";
import {Pages} from "../../page-urls";

function WorkspaceCardSetCreatePage() {
    const state = useAppState();
    const actions = useActions();

    const scope = state.page.current === Pages.WorkspaceCardSetCreate ? 'create' : 'edit';

    if (state.signIn.user!.isGuest) {
        return <Container className="my-5"><Alert variant="danger">Only signed in users are allowed to {scope} Card Sets</Alert></Container>;
    }

    if (state.workspace.workspace === null) {
        if (state.workspaces.loading) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }

    if (scope === 'edit' && state.workspaceCardSet.cardSet === null) {
        if (state.workspace.cardSetsLoading) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Card Set not found.</Container>
        }
    }

    if (scope === 'edit' && !state.workspaceCardSet.currentUserCanEdit) {
        return <Container className="my-5"><Alert variant="danger">You are not allowed to edit this Card Set</Alert></Container>;
    }

    if (scope === 'create' && !state.workspace.currentUserCanContribute) {
        return <Container className="my-5"><Alert variant="danger">You are not allowed to create Card Sets in this workspace</Alert></Container>;
    }

    return <Container>
        <h1 className="my-5">{scope === 'create' ? 'Create a Card Set ' : 'Edit Card Set ' + state.workspaceCardSet.cardSet!.name} in workspace {state.workspace.workspace.name}</h1>
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
            <Button disabled={state.workspaceCardSetCreate.form.submitDisabled} onClick={() => actions.workspaceCardSetCreate.formSubmit(scope)}>{scope === 'create' ? 'Create Card Set!' : 'Save Card Set!'}</Button>
        </Form>
    </Container>;
}

export default WorkspaceCardSetCreatePage;