import {useActions, useAppState} from "../../overmind";
import {Accordion, Alert, Button, Modal } from "react-bootstrap";
import React from "react";

function AddCardsFromOtherCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    return state.addCardsFromOtherCardSetsModal.open ? <Modal show={true} onHide={() => actions.addCardsFromOtherCardSetsModal.close()}>
        <Modal.Header closeButton>
            <Modal.Title>Add cards from other card sets into this card set <i>{state.addCardsFromOtherCardSetsModal.cardSet!.name}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {state.addCardsFromOtherCardSetsModal.loading ?
                <Alert variant={'info'}>Loading...</Alert> :
                (state.addCardsFromOtherCardSetsModal.otherCardSets.length === 0 ?
                    <Alert variant={'info'}>No other card sets found.</Alert> :
                    <Accordion>{state.addCardsFromOtherCardSetsModal.otherCardSets.map(cardSet =>
                        <Accordion.Item eventKey={cardSet.id.toString()}>
                            <Accordion.Header>{cardSet.name}</Accordion.Header>
                            <Accordion.Body>
                                {cardSet.cards.map(card => <CardPreview card={card} showActionButtons={false} onDeleteCard={() => {}} beingDeleted={false}/>)}
                            </Accordion.Body>
                        </Accordion.Item>)}
                    </Accordion>
                )
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => actions.addCardsFromOtherCardSetsModal.close()} disabled={state.addCardsFromOtherCardSetsModal.disabled}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => actions.addCardsFromOtherCardSetsModal.close()} disabled={state.addCardsFromOtherCardSetsModal.disabled}>
                Yes, I am sure
            </Button>
        </Modal.Footer>
    </Modal> : null;
}

export default AddCardsFromOtherCardSetsModal;