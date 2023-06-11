import {Button, Form, Modal} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";

type Props = {
    open: boolean;
    onAdd: (user: PermissionUser) => void;
    onClose: () => void;
}

function AddUserModal(props: Props) {
    const state = useAppState();
    const actions = useActions();

    if (!props.open) {
        return null;
    }
    return <Modal show={true} onHide={props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Add user to workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className="col-lg-5">
                <Form.Group className="mb-3" controlId="workspaceName" >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter users email"
                        value={state.addUserModal.email}
                        isInvalid={state.addUserModal.errorMessage !== null}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.addUserModal.changeEmail(event.currentTarget.value)}/>
                    {state.addUserModal.errorMessage !== null ? <Form.Control.Feedback type="invalid">
                        {state.addUserModal.errorMessage.length > 0 ? state.addUserModal.errorMessage : 'Unexpected error! Please try again later.'}
                    </Form.Control.Feedback> : null}
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onClose} disabled={state.addUserModal.submitting}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.addUserModal.submit(props.onAdd)} disabled={state.addUserModal.submitting}>
                Add user
            </Button>
        </Modal.Footer>
    </Modal>
}

export default AddUserModal;