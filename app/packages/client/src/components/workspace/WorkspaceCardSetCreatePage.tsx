import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form} from "react-bootstrap";
import React from "react";
import {Pages} from "../../page-urls";
import Loading from "../Loading";

function WorkspaceCardSetCreatePage() {
    const state = useAppState();
    const actions = useActions();

    const scope = state.page.page === Pages.WorkspaceCardSetCreate ? 'create' : 'edit';

    if (state.page.workspace === null) {
        if (state.page.loadingWorkspaces) {
            return <Container><Loading text="Loading workspaces..."/></Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }

    if ((scope === 'create' && !state.permission.createCardSet) ||
        (scope === 'edit' && !state.permission.editCardSet)) {
        return <Container className="my-5"><Alert variant="danger">You are not allowed to {scope} Card Sets in this workspace</Alert></Container>;
    }

    if (scope === 'edit' && (state.page.cardSet === null || state.page.loadingCardSets)) {
        if (state.page.loadingCardSets) {
            return <Container><Loading text="Loading card set..."/></Container>;
        } else {
            return <Container>Card set not found.</Container>
        }
    }

    if (state.workspaceCardSetCreate.loading) {
        return <Container><Loading text="Loading..."/></Container>;
    }

    return <Container>
        <h1 className="my-5">{scope === 'edit' ? 'Edit card set ' + (state.page.cardSet?.name ?? 'ERROR') : 'Create a card set'} in workspace {state.page.workspace.name}</h1>
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