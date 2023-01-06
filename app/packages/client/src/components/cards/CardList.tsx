import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";

type Props = {
    cards: Card[];
}

function CardList(props: Props) {
    if (props.cards.length === 0) {
        return <div>No cards found in this card set</div>
    }

    return <div>{
        props.cards.map(card => <CardPreview card={card}/>)
    }</div>;
}

export default CardList;