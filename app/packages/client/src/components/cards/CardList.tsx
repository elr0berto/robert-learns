import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";
import {Col, Container, Row} from "react-bootstrap";
import {CardWithCardSets} from "../../overmind/data/data-state";

type Props = {
    cardsWithCardSets: CardWithCardSets[];
    onDeleteCard: (card: Card) => void;
    onEditCard: (card: Card) => void;
    onEditCardCardSets: (card: Card) => void;
    cardBeingDeleted: Card | null;
    showActionButtons: boolean;
    thisCardSetId: number;
}

function CardList(props: Props) {
    if (props.cardsWithCardSets.length === 0) {
        return <div>No cards found in this card set</div>
    }

    return <Container className="card-preview-list">
        <Row className="row-cols-auto">
            {props.cardsWithCardSets.map(cardWithCardSets => <Col className="col-lg-3 mb-2" key={cardWithCardSets.card.id}>
                <CardPreview
                    thisCardSetId={props.thisCardSetId}
                    beingDeleted={props.cardBeingDeleted?.id === cardWithCardSets.card.id}
                    onDeleteCard={props.onDeleteCard}
                    onEditCard={props.onEditCard}
                    showActionButtons={props.showActionButtons}
                    cardWithCardSets={cardWithCardSets}
                    showCardSetsPreview={true}
                    onEditCardSets={props.onEditCardCardSets}
                />
            </Col>)}
        </Row>
    </Container>;
}

export default CardList;