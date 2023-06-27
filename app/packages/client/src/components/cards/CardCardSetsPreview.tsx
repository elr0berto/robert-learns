import React from 'react';
import {Card, CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Badge, Button} from "react-bootstrap";
import {PencilSquare} from "react-bootstrap-icons";
import {CardWithCardSets} from "../../overmind/data/data-state";

type Props = {
    cardWithCardSets: CardWithCardSets;
    thisCardSetId?: number;
    showEditButton: boolean;
    onEdit: (card: Card) => void;
}

function CardCardSetsPreview(props: Props) {
    return <div className="card-card-sets-preview border p-2">
        <div><small>Card sets</small></div>
        <small>
            {props.cardWithCardSets.cardSets.map(cardSet => (
                <React.Fragment key={cardSet.id}>
                    <Badge className="mr-1" bg={cardSet.id === props.thisCardSetId ? 'primary' : 'secondary'}>
                        {cardSet.name}
                    </Badge>{' '}
                </React.Fragment>
            ))}
        </small>
        {props.showEditButton ? <Button size="sm" variant="outline-primary" className="mt-2" onClick={() => props.onEdit(props.cardWithCardSets.card)}><PencilSquare/> Edit</Button> : null}
    </div>;
}

export default CardCardSetsPreview;