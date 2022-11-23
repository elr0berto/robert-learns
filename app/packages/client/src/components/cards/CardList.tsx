import React from 'react';
import Card from "@elr0berto/robert-learns-shared/dist/api/models/Card";

type Props = {
    cards: Card[];
}

function CardList(props: Props) {
    return <div>CardList {props.cards.length} cards</div>;
}

export default CardList;