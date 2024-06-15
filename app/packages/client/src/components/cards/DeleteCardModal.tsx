import {Alert, Button, Modal} from "react-bootstrap";
import React from "react";
import {CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";
import {CardWithCardSets} from "../../overmind/data/data-state";

type Props = {
    onClose: () => void,
    onConfirm: (allCardSets: boolean) => void,
    cardWithCardSets: CardWithCardSets,
    cardSet: CardSet,
    cardBeingDeletedExistsInOtherCardSets: CardSet[],
    confirming: boolean;
    loading: boolean;
}
function DeleteCardModal(props: Props) {
    return <Modal show={true} onHide={props.confirming || props.loading ? () => {} : props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Delete card from card set <i>{props.cardSet.name}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                props.loading ?
                'Loading...' :
                <>
                    <CardPreview
                        thisCardSetId={props.cardSet.id}
                        cardWithCardSets={props.cardWithCardSets}
                        showActionButtons={false}
                        onDeleteCard={() => {}}
                        onEditCard={() => {}}
                        beingDeleted={false}
                        showCardSetsPreview={true}
                        onEditCardSets={() => {}}/>
                    <hr/>
                    {props.cardBeingDeletedExistsInOtherCardSets.length === 0 ?
                        <Alert variant={'danger'}>This card does not exists in any other card-sets! Deleting it means it will be permanently gone! Are you sure?</Alert> :
                        <Alert variant={'warning'}>This card is also in the following card-sets: <strong>{props.cardBeingDeletedExistsInOtherCardSets.map(cs => cs.name).join(', ')}</strong>.<br/> Would you like to delete it from card-set <i>{props.cardSet.name}</i> or delete it from all card-sets and deleting the card permanently?</Alert>}
                </>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onClose} disabled={props.confirming || props.loading}>
                Cancel
            </Button>
            {props.cardBeingDeletedExistsInOtherCardSets.length === 0 ?
            <Button variant="primary" onClick={() => props.onConfirm(false)} disabled={props.confirming || props.loading}>
                Yes, I am sure
            </Button> :
            <>
                <Button variant="outline-danger" onClick={() => props.onConfirm(true)} disabled={props.confirming || props.loading}>
                    Yes, from all card sets
                </Button>
                <Button variant="danger" onClick={() => props.onConfirm(false)} disabled={props.confirming || props.loading}>
                    Yes, from this card set
                </Button>
            </>}
        </Modal.Footer>
    </Modal>
}

export default DeleteCardModal;