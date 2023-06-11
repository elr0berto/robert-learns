import React from 'react';
import {Card, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Form} from "react-bootstrap";
import CardPreview from "./CardPreview";

type Props = {
    uniqueContext: string;
    card: Card;
    cardSets: CardSet[];
    onDeleteCard: (card: Card) => void;
    beingDeleted: boolean;
    showActionButtons: boolean;
    selected: boolean;
    disabled: boolean;
    onChange: (selected: boolean) => void;
    thisCardSetId: number;
}

function CardPreviewSelectable(props: Props) {
    return <div className={"card-preview-selectable" + (props.selected ? ' card-preview-selected' : '') + (props.disabled ? ' card-preview-disabled' : '')}>
        <CardPreview
            thisCardSetId={props.thisCardSetId}
            card={props.card}
            cardSets={props.cardSets}
            showActionButtons={props.showActionButtons}
            onEditCard={() => {}}
            onDeleteCard={props.onDeleteCard}
            beingDeleted={props.beingDeleted}
            showCardSetsPreview={false}
            onEditCardSets={() => {}}
        />
        <Form.Group className="mb-3" controlId={'checkbox-card-'+props.uniqueContext+'-'+props.card.id}>
            <Form.Check
                type="checkbox"
                label={"Add card" + (props.disabled ? " (already in current card set)" : '')}
                checked={props.selected}
                disabled={props.disabled}
                onChange={event=> props.onChange(event.target.checked)}
            />
        </Form.Group>
    </div>;
}

export default CardPreviewSelectable;