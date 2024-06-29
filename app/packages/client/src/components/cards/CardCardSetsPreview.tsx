import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Badge, Button} from "react-bootstrap";
import {PencilSquare} from "react-bootstrap-icons";
import {CardWithCardSetsWithFlatAncestorCardSets} from "../../overmind/data/data-state";

type Props = {
    cardWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets;
    thisCardSetId?: number;
    showEditButton: boolean;
    onEdit: (card: Card) => void;
}

function CardCardSetsPreview(props: Props) {
    let flatAncestorCardSets = props.cardWithCardSetsWithFlatAncestorCardSets.cardSetsWithFlatAncestorCardSets.flatMap(c => c.flatAncestorCardSets);
    // unique by id
    flatAncestorCardSets = flatAncestorCardSets.filter((c, index) => flatAncestorCardSets.findIndex(c2 => c2.id === c.id) === index);

    return <div className="card-card-sets-preview border p-2">
        <small>
            {flatAncestorCardSets.map(ancestorCardSet =>
                <Badge className="me-1 border border-light" bg={'light'} text="secondary" key={ancestorCardSet.id}>
                    {ancestorCardSet.name}
                </Badge>
            )}
            {props.cardWithCardSetsWithFlatAncestorCardSets.cardSetsWithFlatAncestorCardSets.map(cardSetWithFlatAncestorCardSets =>
                <React.Fragment key={cardSetWithFlatAncestorCardSets.cardSet.id}>
                    <Badge
                        className={"me-1" + (cardSetWithFlatAncestorCardSets.cardSet.id === props.thisCardSetId ? " border border-secondary" : "")}
                        bg={'light'}
                        text={'dark'}
                    >
                        {cardSetWithFlatAncestorCardSets.cardSet.name}
                    </Badge>
                </React.Fragment>
            )}
        </small>
        {props.showEditButton ? <Button size="sm" variant="outline-primary" className="mt-2" onClick={() => props.onEdit(props.cardWithCardSetsWithFlatAncestorCardSets.card)}><PencilSquare/> Change Card Sets</Button> : null}
    </div>;
}

export default CardCardSetsPreview;