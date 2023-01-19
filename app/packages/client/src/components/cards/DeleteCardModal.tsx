import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form, Modal, Tab, Tabs} from "react-bootstrap";
import React from "react";
import {Card, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";

type Props = {
    onClose: () => void,
    onConfirm: () => void,
    card: Card,
    cardSet: CardSet,
    cardBeingDeletedExistsInOtherCardSets: CardSet[],
    confirming: boolean;
}
function DeleteCardModal(props: Props) {
    return <Modal show={true} onHide={props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Delete card from card set <i>{props.cardSet.name}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <CardPreview card={props.card} showActionButtons={false} onDeleteCard={() => {}} beingDeleted={false}/>
            <hr/>
            {props.cardBeingDeletedExistsInOtherCardSets.length === 0 ?
                <Alert variant={'danger'}>This card does not exists in any other card-sets! Deleting it means it will be permanently gone! Are you sure?</Alert> :
                <Alert variant={'warning'}>This card is also in the following card-sets: <strong>{props.cardBeingDeletedExistsInOtherCardSets.map(cs => cs.name).join(', ')}</strong>. You are now deleting the card from this card-set <i>{props.cardSet.name}</i> it will still remain in those other card-sets. Are you sure?</Alert>}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onClose} disabled={props.confirming}>
                Cancel
            </Button>
            <Button variant="primary" onClick={props.onConfirm} disabled={props.confirming}>
                Yes, I am sure
            </Button>
        </Modal.Footer>
    </Modal>
}

export default DeleteCardModal;