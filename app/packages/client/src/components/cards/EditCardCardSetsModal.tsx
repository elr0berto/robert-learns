import {useActions, useAppState} from "../../overmind";
import {Accordion, Alert, Button, Modal} from "react-bootstrap";
import React from "react";
import CardPreviewSelectable from "./CardPreviewSelectable";
import CardPreview from "./CardPreview";

function EditCardCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    return state.editCardCardSetsModal.open ? <Modal className="edit-card-card-sets-modal" show={true} size="lg" onHide={() => actions.editCardCardSetsModal.close()}>
        <Modal.Header closeButton>
            <Modal.Title>Select card sets for card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <CardPreview
                card={state.editCardCardSetsModal.card}
                showActionButtons={false}
                onDeleteCard={() => {}}
                beingDeleted={false}
                onEditCard={() => {}}

            />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => actions.addCardsFromOtherCardSetsModal.close()} disabled={state.addCardsFromOtherCardSetsModal.disabled}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.addCardsFromOtherCardSetsModal.save()} disabled={state.addCardsFromOtherCardSetsModal.disabled}>
                Save
            </Button>
            {state.addCardsFromOtherCardSetsModal.submitError ? <Alert variant={'danger'}>{state.addCardsFromOtherCardSetsModal.submitError}</Alert> : null}
        </Modal.Footer>
    </Modal> : null;
}

export default EditCardCardSetsModal;