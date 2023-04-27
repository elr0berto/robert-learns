import {useActions, useAppState} from "../../overmind";
import {Accordion, Alert, Button, Modal } from "react-bootstrap";
import React from "react";
import CardPreview from "./CardPreview";
import CardPreviewSelectable from "./CardPreviewSelectable";

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
                (state.addCardsFromOtherCardSetsModal.otherCardSetsWithCards.length === 0 ?
                    <Alert variant={'info'}>No other card sets found.</Alert> :
                    <Accordion>{state.addCardsFromOtherCardSetsModal.otherCardSetsWithCards.map(cardSetWithCards =>
                        <Accordion.Item eventKey={cardSetWithCards.id.toString()}>
                            <Accordion.Header>{cardSetWithCards.name}</Accordion.Header>
                            <Accordion.Body>
                                {cardSetWithCards.cards.map(card => <CardPreviewSelectable
                                    disabled={card.alreadyInCurrentCardSet}
                                    selected={card.alreadyInCurrentCardSet || card.selected}
                                    card={card.card}
                                    showActionButtons={false}
                                    onDeleteCard={() => {}}
                                    beingDeleted={false}
                                    onChange={(selected => actions.addCardsFromOtherCardSetsModal.setSelected({cardId: card.card.id, selected: selected}))}/>)}
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
            <Button variant="primary" onClick={() => actions.addCardsFromOtherCardSetsModal.save()} disabled={state.addCardsFromOtherCardSetsModal.disabled}>
                Save
            </Button>
        </Modal.Footer>
    </Modal> : null;
}

export default AddCardsFromOtherCardSetsModal;