import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Form} from "react-bootstrap";
import CardPreview from "./CardPreview";
import {CardWithCardSetsWithFlatAncestorCardSets} from "../../overmind/data/data-state";

type Props = {
    uniqueContext: string;
    cardWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets;
    onDeleteCard?: (card: Card) => void;
    beingDeleted: boolean;
    showActionButtons: boolean;
    selected: boolean;
    disabled: boolean;
    onChange: (cardId: number, selected: boolean) => void;
    thisCardSetId: number;
}

function CardPreviewSelectable(props: Props) {
    return <div
        className={"card-preview-selectable" + (props.selected ? ' card-preview-selected' : '') + (props.disabled ? ' card-preview-disabled' : '')}
    >
        <CardPreview
            thisCardSetId={props.thisCardSetId}
            cardWithCardSetsWithFlatAncestorCardSets={props.cardWithCardSetsWithFlatAncestorCardSets}
            showActionButtons={props.showActionButtons}
            onEditCard={() => {}}
            onDeleteCard={props.onDeleteCard ? props.onDeleteCard : () => {}}
            beingDeleted={props.beingDeleted}
            showCardSetsPreview={false}
            onEditCardSets={() => {}}
            onClick={() => props.onChange(props.cardWithCardSetsWithFlatAncestorCardSets.card.id, !props.selected)}
        />
        <Form.Group className="mb-3" controlId={'checkbox-card-'+props.uniqueContext+'-'+props.cardWithCardSetsWithFlatAncestorCardSets.card.id}>
            <Form.Check
                type="checkbox"
                label={"Add card" + (props.disabled ? " (already in current card set)" : '')}
                checked={props.selected}
                disabled={props.disabled}
                onChange={event=> props.onChange(props.cardWithCardSetsWithFlatAncestorCardSets.card.id, event.target.checked)}
            />
        </Form.Group>
    </div>;
}

export default CardPreviewSelectable;