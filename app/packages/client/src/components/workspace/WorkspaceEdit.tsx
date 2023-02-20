import {Alert, Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";
import AddUserModal from "./AddUserModal";

function WorkspaceEdit() {
    const state = useAppState();
    const actions = useActions();

    if (state.signIn.user!.isGuest) {
        return <Container className="my-5"><Alert variant="danger">Only signed in users are allowed to edit workspaces</Alert></Container>;
    }

    if (state.workspaceEdit.workspace === null) {
        if (state.workspaces.loading) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }

    return <Container>
        <h1 className="my-5">Edit workspace {state.workspaceEdit.workspace.name}</h1>
        <Form className="col-lg-5">
            <Form.Group className="mb-3" controlId="workspaceName">
                <Form.Label>Workspace Name</Form.Label>
                <Form.Control type="text" placeholder="Enter workspace name" value={state.workspaceEdit.form.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceEdit.changeFormName(event.currentTarget.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="workspaceDescription">
                <Form.Label>Workspace Description</Form.Label>
                <Form.Control type="text" placeholder="Please provide a short description for your workspace" value={state.workspaceEdit.form.description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceEdit.changeFormDescription(event.currentTarget.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="workspaceAllowGuests">
                <Form.Check type="checkbox" label="Allow anyone to view this workspace" checked={state.workspaceEdit.form.allowGuests} onChange={evt => actions.workspaceEdit.changeAllowGuests(evt.currentTarget.checked)}/>
            </Form.Group>
            <hr/>
            <h5>Users</h5>
            <p>Add additional users for your workspace</p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{state.signIn.user!.name()}</td>
                        <td colSpan={2}>OWNER</td>
                    </tr>
                    {state.workspaceEdit.form.selectedUsers.length > 0 ?
                        state.workspaceEdit.form.selectedUsers.map(u => <tr key={u.userId}>
                            <td>{u.name}</td>
                            <td>
                                <Form.Select value={u.role} onChange={evt => actions.workspaceEdit.changeUserRole({user: u, role: evt.target.value})}>
                                    <option>Select role</option>
                                    {state.workspaceEdit.form.availableRoles.map(role => <option value={role}>{role}</option>)}
                                </Form.Select>
                            </td>
                            <td>
                                <Button type="button" size='sm' variant="outline-danger" onClick={() => actions.workspaceEdit.removeUser(u.userId)}>Remove</Button>
                            </td>
                        </tr>) : null}
                </tbody>
            </Table>
            <Button type="button" variant='outline-primary' size='sm' onClick={() => actions.workspaceEdit.addUserModalOpen()}>Add user</Button>
            <hr/>
            {state.workspaceEdit.form.showErrors ? <Alert variant="danger">{state.workspaceEdit.form.allErrors.map((err: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, i: React.Key | null | undefined) => <p key={i}>{err}</p>)}</Alert> : null}
            <Button disabled={state.workspaceEdit.form.submitDisabled} onClick={() => actions.workspaceEdit.formSubmit()}>Create Workspace!</Button>
        </Form>
        <AddUserModal onAdd={user => actions.workspaceEdit.addUser(user)} open={state.workspaceEdit.form.addUserOpen} onClose={() => actions.workspaceEdit.addUserModalClose()}/>
    </Container>;
}

export default WorkspaceEdit;