import {Alert, Button, Modal} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";


function DeleteWorkspaceModal() {
    const state = useAppState();
    const actions = useActions();

    if (!state.workspaceCreate.deleteWorkspaceModalOpen) {
        return null;
    }

    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }

    const onHide = () => {
        actions.workspaceCreate.deleteWorkspaceClose();
    }
    return <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Delete workspace {state.page.workspace?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure?
            {state.workspaceCreate.deleteWorkspaceError !== null ? <Alert variant={'danger'}>{state.workspaceCreate.deleteWorkspaceError}</Alert> : null}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={state.workspaceCreate.deletingWorkspace}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.workspaceCreate.deleteWorkspaceConfirm()} disabled={state.workspaceCreate.deletingWorkspace}>
                Yes, Im sure. Delete the workspace!
            </Button>
        </Modal.Footer>
    </Modal>
}

export default DeleteWorkspaceModal;