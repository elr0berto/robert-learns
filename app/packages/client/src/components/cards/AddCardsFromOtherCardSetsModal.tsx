import {useActions, useAppState} from "../../overmind";
import {Accordion, Alert, Button, Modal} from "react-bootstrap";
import React, {useCallback} from "react";
import CardPreviewSelectable from "./CardPreviewSelectable";
import {
    CardSetWithCardsAndChildren
} from "../../overmind/add-cards-from-other-card-sets-modal/add-cards-from-other-card-sets-modal-state";

const MemoizedCardPreviewSelectable = React.memo(CardPreviewSelectable);

function AddCardsFromOtherCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    if (state.page.cardSet === null) {
        throw new Error('state.page.cardSet is null');
    }

    const changeSelected = useCallback((cardId: number, selected: boolean) => {
        actions.addCardsFromOtherCardSetsModal.setSelected({cardId, selected});
    }, [actions.addCardsFromOtherCardSetsModal]);

    const renderAccordionItems = (cardSetWithCardsAndChildren: CardSetWithCardsAndChildren[]) => {
        return cardSetWithCardsAndChildren.map(cardSetWithCardsAndChildren => (
            <Accordion.Item eventKey={cardSetWithCardsAndChildren.cardSet.id.toString()} key={cardSetWithCardsAndChildren.cardSet.id}>
                <Accordion.Header>{cardSetWithCardsAndChildren.cardSet.name}</Accordion.Header>
                <Accordion.Body>
                    {cardSetWithCardsAndChildren.children.length === 0 && cardSetWithCardsAndChildren.cards.map(card => (
                        <MemoizedCardPreviewSelectable
                            thisCardSetId={cardSetWithCardsAndChildren.cardSet.id}
                            uniqueContext={cardSetWithCardsAndChildren.cardSet.id.toString()}
                            key={card.cardWithCardSetsWithFlatAncestorCardSets.card.id}
                            disabled={card.alreadyInCurrentCardSet}
                            selected={card.alreadyInCurrentCardSet || state.addCardsFromOtherCardSetsModal.selectedCardIds.includes(card.cardWithCardSetsWithFlatAncestorCardSets.card.id)}
                            cardWithCardSetsWithFlatAncestorCardSets={card.cardWithCardSetsWithFlatAncestorCardSets}
                            showActionButtons={false}
                            beingDeleted={false}
                            onChange={changeSelected}
                        />
                    ))}
                    {cardSetWithCardsAndChildren.children.length > 0 && (
                        <Accordion className="w-100">
                            {renderAccordionItems(cardSetWithCardsAndChildren.children)}
                        </Accordion>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        ));
    };

    return state.addCardsFromOtherCardSetsModal.open ? <Modal className="add-cards-from-other-card-sets-modal" show={true} size="lg" onHide={() => actions.addCardsFromOtherCardSetsModal.close()}>
        <Modal.Header closeButton>
            <Modal.Title>Add cards from other card sets into <i>{state.page.cardSet.name}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {state.addCardsFromOtherCardSetsModal.loading ?
                <Alert variant={'info'}>Loading...</Alert> :
                (state.addCardsFromOtherCardSetsModal.otherCardSetsWithCardsAndChildren.length === 0 ?
                    <Alert variant={'info'}>No other card sets with cards found.</Alert> :
                    <Accordion>
                        {renderAccordionItems(state.addCardsFromOtherCardSetsModal.otherCardSetsWithCardsAndChildren)}
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