import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";
import {Button, Col, Container, Row} from "react-bootstrap";
import {CardWithCardSets} from "../../overmind/data/data-state";
import {ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight} from "react-bootstrap-icons";
import {SortDirection} from "../../overmind/workspace-card-set/workspace-card-set-actions";

type Props = {
    cardsWithCardSets: CardWithCardSets[];
    onDeleteCard: (card: Card) => void;
    onEditCard: (card: Card) => void;
    onEditCardCardSets: (card: Card) => void;
    cardBeingDeleted: Card | null;
    showActionButtons: boolean;
    thisCardSetId: number;
    sorting?: boolean;
    onSortCard?: (cardId: number, direction: SortDirection) => void;
}

function CardList(props: Props) {
    if (props.cardsWithCardSets.length === 0) {
        return <div>No cards found in this card set</div>
    }


    return <Container className="card-preview-list">
        <Row className="row-cols-auto">
            {props.cardsWithCardSets.map(cardWithCardSets =>
                <Col className="col-lg-3 mb-2" key={cardWithCardSets.card.id}>
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
                    {props.sorting ?
                        <div className="sort-buttons">
                            <Button onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSets.card.id, 'first') : null}><ChevronDoubleLeft/></Button>
                            <Button onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSets.card.id, 'up') : null}><ChevronLeft/></Button>
                            <Button onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSets.card.id, 'down') : null}><ChevronRight/></Button>
                            <Button onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSets.card.id, 'last') : null}><ChevronDoubleRight/></Button>
                        </div> : null}
                </Col>
            )}
        </Row>
    </Container>;

}

export default CardList;