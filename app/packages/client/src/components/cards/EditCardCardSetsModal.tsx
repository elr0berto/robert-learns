import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React from "react";
import CardPreview from "./CardPreview";

function EditCardCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    if (!state.editCardCardSetsModal.open) {
        return null;
    }

    if (state.editCardCardSetsModal.cardWithCardSets === null) {
        throw new Error('state.editCardCardSetsModal.cardWithCardSets is null');
    }

    return <Modal className="edit-card-card-sets-modal" show={true} size="lg" onHide={state.editCardCardSetsModal.closeDisabled ? () => {} : () => actions.editCardCardSetsModal.close()}>
        <Modal.Header closeButton>
            <Modal.Title>Select card sets for card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col>
                        <CardPreview
                            cardWithCardSets={state.editCardCardSetsModal.cardWithCardSets}
                            showActionButtons={false}
                            onDeleteCard={() => {}}
                            beingDeleted={false}
                            onEditCard={() => {}}
                            showCardSetsPreview={false}
                            onEditCardSets={() => {}}
                        />
                    </Col>
                    <Col>
                        {state.editCardCardSetsModal.loading ?
                            <div>Loading...</div> :
                            state.editCardCardSetsModal.cardSets.map(cardSet =>
                                <Form.Group className="mb-3" controlId={'editCardSet'+cardSet.id}>
                                    <Form.Check
                                        type="checkbox"
                                        label={cardSet.name}
                                        checked={state.editCardCardSetsModal.selectedCardSetIds.indexOf(cardSet.id) !== -1}
                                        disabled={state.editCardCardSetsModal.formDisabled}
                                        onChange={event => actions.editCardCardSetsModal.setSelectedCardSetId({
                                            cardSetId: cardSet.id,
                                            selected: event.target.checked
                                        })}
                                    />
                                </Form.Group>
                            )
                        }
                        {state.editCardCardSetsModal.validationError ? <Alert variant={'danger'}>{state.editCardCardSetsModal.validationError}</Alert> : null}
                    </Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => actions.editCardCardSetsModal.close()} disabled={state.editCardCardSetsModal.closeDisabled}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.editCardCardSetsModal.save()} disabled={state.editCardCardSetsModal.submitDisabled}>
                Save
            </Button>
            {state.editCardCardSetsModal.submitError ? <Alert variant={'danger'}>{state.editCardCardSetsModal.submitError}</Alert> : null}
        </Modal.Footer>
    </Modal>;
}

export default EditCardCardSetsModal;