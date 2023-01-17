import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";
import {Col, Container, Row} from "react-bootstrap";

type Props = {
    cards: Card[];
    onDeleteCard: (card: Card) => void;
    cardIdsBeingDeleted: number[];
}

function CardList(props: Props) {
    if (props.cards.length === 0) {
        return <div>No cards found in this card set</div>
    }

    return <Container className="card-preview-list">
        <Row className="row-cols-auto">
            {props.cards.map(card => <Col className="col-lg-3">
                <CardPreview
                    beingDeleted={props.cardIdsBeingDeleted.includes(card.id)}
                    onDeleteCard={props.onDeleteCard}
                    card={card}/>
            </Col>)}
        </Row>
    </Container>;
}

export default CardList;