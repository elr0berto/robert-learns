import {Alert, Button, Container, Form, Table} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";
import AddUserModal from "./AddUserModal";
import {Pages} from "../../page-urls";

function WorkspaceCreate() {
    const state = useAppState();
    const actions = useActions();

    const scope = state.page.page === Pages.WorkspaceCreate ? 'create' : 'edit';

    if (scope === 'create' && !state.permission.createWorkspace) {
        return <Container className="my-5"><Alert variant="danger">Only signed in users are allowed to {scope} workspaces</Alert></Container>;
    }

    if (scope === 'edit' && state.page.workspace === null) {
        if (state.page.loadingWorkspaces) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }

    if (scope === 'edit' && !state.permission.editWorkspace) {
        return <Container className="my-5"><Alert variant="danger">You are not allowed to edit this workspace</Alert></Container>;
    }


    return <Container>
        <h1 className="my-5">{scope === 'create' ? 'Create a workspace' : 'Edit workspace ' + state.page.workspace.name}</h1>
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
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {scope === 'create' ?
                    <tr>
                        <td>{state.signIn.user.name()}</td>
                        <td colSpan={2}>OWNER</td>
                    </tr> : null}
                    {state.workspaceCreate.form.selectedUsersWithData.length > 0 ?
                        state.workspaceCreate.form.selectedUsersWithData.map(u => <tr key={u.userId}>
                            <td>{u.name}</td>
                            <td>
                                <Form.Select
                                    disabled={!u.canRoleBeChanged}
                                    value={u.role}
                                    onChange={evt => actions.workspaceCreate.changeUserRole({user: u, role: evt.target.value})}>
                                    <option>Select role</option>
                                    {u.availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                </Form.Select>
                            </td>
                            <td>
                                <Button
                                    disabled={!u.canBeRemoved}
                                    type="button"
                                    size='sm'
                                    variant="outline-danger"
                                    onClick={() => actions.workspaceCreate.removeUser(u.userId)}>Remove</Button>
                            </td>
                        </tr>) : null}
                </tbody>
            </Table>
            <Button type="button" variant='outline-primary' size='sm' onClick={() => actions.workspaceCreate.addUserModalOpen()}>Add user</Button>
            <hr/>
            {state.workspaceCreate.form.showErrors ? <Alert variant="danger">{state.workspaceCreate.form.allErrors.map((err: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, i: React.Key | null | undefined) => <p key={i}>{err}</p>)}</Alert> : null}
            <Button disabled={state.workspaceCreate.form.submitDisabled} onClick={() => actions.workspaceCreate.formSubmit(scope)}>{scope === 'create' ? 'Create Workspace!' : 'Save workspace!'}</Button>
        </Form>
        <AddUserModal
            onAdd={user => actions.workspaceCreate.addUser(user)}
            open={state.workspaceCreate.form.addUserOpen}
            onClose={() => actions.workspaceCreate.addUserModalClose()}
        />
    </Container>;
}

export default WorkspaceCreate;