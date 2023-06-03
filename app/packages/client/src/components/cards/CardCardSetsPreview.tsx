import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Badge, Button} from "react-bootstrap";
import {PencilSquare} from "react-bootstrap-icons";

type Props = {
    card: Card;
    thisCardSetId?: number;
    showEditButton: boolean;
    onEdit: (card: Card) => void;
}

function CardCardSetsPreview(props: Props) {
    return <div className="card-card-sets-preview border p-2">
        <div><small>Card sets</small></div>
        <small>
            {props.card.cardSets.map(cardSet => (
                <React.Fragment key={cardSet.id}>
                    <Badge className="mr-1" bg={cardSet.id === props.thisCardSetId ? 'primary' : 'secondary'}>
                        {cardSet.name}
                    </Badge>{' '}
                </React.Fragment>
            ))}
        </small>
        {props.showEditButton ? <Button size="sm" variant="outline-primary" className="mt-2" onClick={() => props.onEdit(props.card)}><PencilSquare/> Edit</Button> : null}
    </div>;
}

export default CardCardSetsPreview;