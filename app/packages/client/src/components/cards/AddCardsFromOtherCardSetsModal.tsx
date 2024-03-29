import {useActions, useAppState} from "../../overmind";
import {Accordion, Alert, Button, Modal} from "react-bootstrap";
import React from "react";
import CardPreviewSelectable from "./CardPreviewSelectable";

function AddCardsFromOtherCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    if (state.page.cardSet === null) {
        throw new Error('state.page.cardSet is null');
    }

    return state.addCardsFromOtherCardSetsModal.open ? <Modal className="add-cards-from-other-card-sets-modal" show={true} size="lg" onHide={() => actions.addCardsFromOtherCardSetsModal.close()}>
        <Modal.Header closeButton>
            <Modal.Title>Add cards from other card sets into <i>{state.page.cardSet.name}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {state.addCardsFromOtherCardSetsModal.loading ?
                <Alert variant={'info'}>Loading...</Alert> :
                (state.addCardsFromOtherCardSetsModal.otherCardSetsWithCards.length === 0 ?
                    <Alert variant={'info'}>No other card sets with cards found.</Alert> :
                    <Accordion>{state.addCardsFromOtherCardSetsModal.otherCardSetsWithCards.map(cardSetWithCards =>
                        <Accordion.Item eventKey={cardSetWithCards.cardSet.id.toString()}>
                            <Accordion.Header>{cardSetWithCards.cardSet.name}</Accordion.Header>
                            <Accordion.Body>
                                {cardSetWithCards.cards.map(card => <CardPreviewSelectable
                                    thisCardSetId={cardSetWithCards.cardSet.id}
                                    uniqueContext={cardSetWithCards.cardSet.id.toString()}
                                    key={card.cardWithCardSets.card.id}
                                    disabled={card.alreadyInCurrentCardSet}
                                    selected={card.alreadyInCurrentCardSet || card.selected}
                                    cardWithCardSets={card.cardWithCardSets}
                                    showActionButtons={false}
                                    onDeleteCard={() => {}}
                                    beingDeleted={false}
                                    onChange={(selected => actions.addCardsFromOtherCardSetsModal.setSelected({cardId: card.cardWithCardSets.card.id, selected: selected}))}/>)}
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
            {state.addCardsFromOtherCardSetsModal.submitError ? <Alert variant={'danger'}>{state.addCardsFromOtherCardSetsModal.submitError}</Alert> : null}
        </Modal.Footer>
    </Modal> : null;
}

export default AddCardsFromOtherCardSetsModal;