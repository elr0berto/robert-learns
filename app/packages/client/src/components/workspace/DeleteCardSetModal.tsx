import {Alert, Button, Modal} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";


function DeleteCardSetModal() {
    const state = useAppState();
    const actions = useActions();

    if (!state.workspaceCardSet.deleteCardSetModalOpen) {
        return null;
    }

    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }
    if (state.page.cardSet === null) {
        throw new Error('CardSet is null');
    }

    const onHide = () => {
        actions.workspaceCardSet.deleteCardSetClose();
    }
    return <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Delete card set {state.page.cardSet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure?
            {state.workspaceCardSet.deleteCardSetError !== null ? <Alert variant={'danger'}>{state.workspaceCardSet.deleteCardSetError}</Alert> : null}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide} disabled={state.workspaceCardSet.deletingCardSet}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.workspaceCardSet.deleteCardSetConfirm()} disabled={state.workspaceCardSet.deletingCardSet}>
                Yes, Im sure. Delete the card set!
            </Button>
        </Modal.Footer>
    </Modal>
}

export default DeleteCardSetModal;