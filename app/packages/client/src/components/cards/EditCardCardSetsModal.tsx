import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React from "react";
import CardPreview from "./CardPreview";

function EditCardCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    return state.editCardCardSetsModal.open ? <Modal className="edit-card-card-sets-modal" show={true} size="lg" onHide={() => actions.editCardCardSetsModal.close()}>
        <Modal.Header closeButton>
            <Modal.Title>Select card sets for card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col>
                        <CardPreview
                            card={state.editCardCardSetsModal.card!}
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
                                        onChange={event => actions.editCardCardSetsModal.setSelectedCardSetId({
                                            cardSetId: cardSet.id,
                                            selected: event.target.checked
                                        })}
                                    />
                                </Form.Group>
                            )
                        }
                    </Col>
                </Row>
            </Container>
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