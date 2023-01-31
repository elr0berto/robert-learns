import {Alert, Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";
import AddUserModal from "./AddUserModal";

function WorkspaceCreate() {
    const state = useAppState();
    const actions = useActions();

    if (state.signIn.user!.isGuest) {
        return <Container className="my-5"><Alert variant="danger">Only signed in users are allowed to create workspaces</Alert></Container>;
    }
    return <Container>
        <h1 className="my-5">Create a workspace</h1>
        <Form className="col-lg-5">
            <Form.Group className="mb-3" controlId="workspaceName">
                <Form.Label>Workspace Name</Form.Label>
                <Form.Control type="text" placeholder="Enter workspace name" value={state.workspaceCreate.form.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceCreate.changeFormName(event.currentTarget.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="workspaceDescription">
                <Form.Label>Workspace Description</Form.Label>
                <Form.Control type="text" placeholder="Please provide a short description for your workspace" value={state.workspaceCreate.form.description} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.workspaceCreate.changeFormDescription(event.currentTarget.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="workspaceAllowGuests">
                <Form.Check type="checkbox" label="Allow anyone to view this workspace" checked={state.workspaceCreate.form.allowGuests} onChange={evt => actions.workspaceCreate.changeAllowGuests(evt.currentTarget.checked)}/>
            </Form.Group>
            <hr/>
            <h5>Users</h5>
            <p>Add additional users for your workspace</p>
            <Table striped bordered hover>
                <thead>
                    <th>Name</th>
                    <th>Role</th>
                    <th>&nbsp;</th>
                </thead>
                <tbody>
                    <tr>
                        <td>{state.signIn.user!.name()}</td>
                        <td colSpan={2}>OWNER</td>
                    </tr>
                    {state.workspaceCreate.form.selectedUsers.length > 0 ?
                        state.workspaceCreate.form.selectedUsers.map(u => <tr>
                            <td>{u.name}</td>
                            <td>
                                <Form.Select value={u.role} onChange={evt => actions.workspaceCreate.changeUserRole({user: u, role: evt.target.value})}>
                                    <option>Select role</option>
                                    {state.workspaceCreate.form.availableRoles.map(role => <option value={role}>{role}</option>)}
                                </Form.Select>
                            </td>
                            <td>
                                <Button type="button" variant="outline-danger" onClick={() => actions.workspaceCreate.removeUser(u.userId)}>Remove</Button>
                            </td>
                        </tr>) : null}
                </tbody>
            </Table>
            <Button type="button" onClick={() => actions.workspaceCreate.addUserModalOpen()}>Add user</Button>
            <hr/>
            {state.workspaceCreate.form.showErrors ? <Alert variant="danger">{state.workspaceCreate.form.allErrors.map((err: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, i: React.Key | null | undefined) => <p key={i}>{err}</p>)}</Alert> : null}
            <Button disabled={state.workspaceCreate.form.submitDisabled} onClick={() => actions.workspaceCreate.formSubmit()}>Create Workspace!</Button>
        </Form>
        <AddUserModal onAdd={user => actions.workspaceCreate.addUser(user)} open={state.workspaceCreate.form.addUserOpen} onClose={() => actions.workspaceCreate.addUserModalClose()}/>
    </Container>;
}

export default WorkspaceCreate;