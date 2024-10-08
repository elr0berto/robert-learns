import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React from "react";
import CardPreview from "./CardPreview";
import {CardSetWithChildrenAndCardCounts} from "../../overmind/data/data-state";
import {Folder} from 'react-bootstrap-icons';
import Loading from "../Loading";

function CardSetCheckbox({cardSetWithChildrenAndCardCounts, level}: { cardSetWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts, level: number }) {
    const state = useAppState();
    const actions = useActions();

    const marginLeft = `${level}rem`;

    return (
        <>
            {cardSetWithChildrenAndCardCounts.children.length > 0 ? (
                <div className="mb-2" style={{marginLeft, display: 'flex', alignItems: 'center'}}>
                    <Folder style={{ marginRight: '0.5rem' }} />
                    <span>{cardSetWithChildrenAndCardCounts.cardSet.name}</span>
                </div>
            ) : (
                <Form.Group className="mb-2" controlId={'editCardSet' + cardSetWithChildrenAndCardCounts.cardSet.id} style={{marginLeft}}>
                    <Form.Check
                        type="checkbox"
                        label={cardSetWithChildrenAndCardCounts.cardSet.name}
                        checked={state.editCardCardSetsModal.selectedCardSetIds.indexOf(cardSetWithChildrenAndCardCounts.cardSet.id) !== -1}
                        disabled={state.editCardCardSetsModal.formDisabled}
                        onChange={event => actions.editCardCardSetsModal.setSelectedCardSetId({
                            cardSetId: cardSetWithChildrenAndCardCounts.cardSet.id,
                            selected: event.target.checked
                        })}
                    />
                </Form.Group>
            )}

            {cardSetWithChildrenAndCardCounts.children.length > 0 ?
                <div className="mb-3">
                    {cardSetWithChildrenAndCardCounts.children.map(child => (
                        <CardSetCheckbox key={child.cardSet.id} cardSetWithChildrenAndCardCounts={child} level={level + 1}/>
                    ))}
                </div> : null}
        </>
    );
}

function EditCardCardSetsModal() {
    const state = useAppState();
    const actions = useActions();

    if (!state.editCardCardSetsModal.open) {
        return null;
    }

    if (state.editCardCardSetsModal.cardWithCardSetsWithFlatAncestorCardSets === null) {
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
                            cardWithCardSetsWithFlatAncestorCardSets={state.editCardCardSetsModal.cardWithCardSetsWithFlatAncestorCardSets}
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
                            <Loading/> :
                            state.editCardCardSetsModal.cardSetsWithChildrenAndCardCounts.map(cardSetWithChildrenAndCardCounts =>
                                <CardSetCheckbox key={cardSetWithChildrenAndCardCounts.cardSet.id} cardSetWithChildrenAndCardCounts={cardSetWithChildrenAndCardCounts} level={0}/>
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