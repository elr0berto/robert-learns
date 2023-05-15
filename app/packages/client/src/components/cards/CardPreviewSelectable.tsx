import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Form} from "react-bootstrap";
import CardPreview from "./CardPreview";

type Props = {
    card: Card;
    onDeleteCard: (card: Card) => void;
    beingDeleted: boolean;
    showActionButtons: boolean;
    selected: boolean;
    disabled: boolean;
    onChange: (selected: boolean) => void;
}

function CardPreviewSelectable(props: Props) {
    return <div className={"card-preview-selectable" + (props.selected ? ' card-preview-selected' : '') + (props.disabled ? ' card-preview-disabled' : '')}>
        <CardPreview card={props.card} showActionButtons={props.showActionButtons} onEditCard={() => {}} onDeleteCard={props.onDeleteCard} beingDeleted={props.beingDeleted}/>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label={"Add card" + (props.disabled ? " (already in current card set)" : '')} checked={props.selected} disabled={props.disabled} onChange={event=> props.onChange(event.target.checked)}/>
        </Form.Group>
    </div>;
}

export default CardPreviewSelectable;