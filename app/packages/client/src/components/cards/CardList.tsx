import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import CardPreview from "./CardPreview";
import {Button, Col, Container, Row} from "react-bootstrap";
import { CardWithCardSetsWithFlatAncestorCardSets} from "../../overmind/data/data-state";
import {ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight} from "react-bootstrap-icons";
import {SortDirection} from "@elr0berto/robert-learns-shared/dist/common";

type Props = {
    cardsWithCardSetsWithFlatAncestorCardSets: CardWithCardSetsWithFlatAncestorCardSets[];
    onDeleteCard: (card: Card) => void;
    onEditCard: (card: Card) => void;
    onEditCardCardSets: (card: Card) => void;
    cardBeingDeleted: Card | null;
    showActionButtons: boolean;
    thisCardSetId: number;
    sorting?: boolean;
    savingSorting?: boolean;
    onSortCard?: (cardId: number, direction: SortDirection) => void;
}

function CardList(props: Props) {
    if (props.cardsWithCardSetsWithFlatAncestorCardSets.length === 0) {
        return <div>No cards found in this card set, create cards or add cards from other card sets or link this card set to other card sets</div>
    }


    return <Container className="card-preview-list">
        <Row className="row-cols-auto">
            {props.cardsWithCardSetsWithFlatAncestorCardSets.map(cardWithCardSetsWithFlatAncestorCardSets =>
                <Col className="col-lg-3 mb-2" key={cardWithCardSetsWithFlatAncestorCardSets.card.id}>
                    <CardPreview
                        thisCardSetId={props.thisCardSetId}
                        beingDeleted={props.cardBeingDeleted?.id === cardWithCardSetsWithFlatAncestorCardSets.card.id}
                        onDeleteCard={props.onDeleteCard}
                        onEditCard={props.onEditCard}
                        showActionButtons={props.showActionButtons}
                        cardWithCardSetsWithFlatAncestorCardSets={cardWithCardSetsWithFlatAncestorCardSets}
                        showCardSetsPreview={true}
                        onEditCardSets={props.onEditCardCardSets}
                    />
                    {props.sorting ?
                        <div className="sort-buttons">
                            <Button disabled={props.savingSorting ?? false} onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSetsWithFlatAncestorCardSets.card.id, 'first') : null}><ChevronDoubleLeft/></Button>
                            <Button disabled={props.savingSorting ?? false} onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSetsWithFlatAncestorCardSets.card.id, 'up') : null}><ChevronLeft/></Button>
                            <Button disabled={props.savingSorting ?? false} onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSetsWithFlatAncestorCardSets.card.id, 'down') : null}><ChevronRight/></Button>
                            <Button  disabled={props.savingSorting ?? false} onClick={() => props.onSortCard ? props.onSortCard(cardWithCardSetsWithFlatAncestorCardSets.card.id, 'last') : null}><ChevronDoubleRight/></Button>
                        </div> : null}
                </Col>
            )}
        </Row>
    </Container>;

}

export default CardList;