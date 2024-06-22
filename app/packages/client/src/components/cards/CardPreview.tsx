import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import AudioPlayer from "react-h5-audio-player";
import CardPreviewFace from "./CardPreviewFace";
import {Button} from "react-bootstrap";
import {DashCircle, PencilSquare} from "react-bootstrap-icons";
import CardCardSetsPreview from "./CardCardSetsPreview";
import {CardWithCardSets} from "../../overmind/data/data-state";

type Props = {
    cardWithCardSets: CardWithCardSets;
    onDeleteCard: (card: Card) => void;
    onEditCard: (card: Card) => void;
    beingDeleted: boolean;
    showActionButtons: boolean;
    thisCardSetId?: number;
    showCardSetsPreview: boolean;
    onEditCardSets: (card: Card) => void;
    onClick?: () => void;
}

function CardPreview(props: Props) {
    return <div className="card-preview border p-2" onClick={props.onClick ? props.onClick : () => {}}>
        <CardPreviewFace content={props.cardWithCardSets.card.front?.content ?? ''}/>
        <hr/>
        <CardPreviewFace content={props.cardWithCardSets.card.back?.content ?? ''}/>
        {props.cardWithCardSets.card.audio !== null ? <AudioPlayer
            src={props.cardWithCardSets.card.audio.getUrl()}
        /> : null}
        {props.showCardSetsPreview ? <>
            <hr/>
            <CardCardSetsPreview
                showEditButton={props.showActionButtons}
                thisCardSetId={props.thisCardSetId}
                cardWithCardSets={props.cardWithCardSets}
                onEdit={props.onEditCardSets}
            />
        </> : null}
        {props.showActionButtons ? <>
            <hr/>
            <Button
                size="sm"
                variant="outline-primary"
                className="mt-2"
                onClick={() => props.onEditCard(props.cardWithCardSets.card)}
            >
                <PencilSquare/> Edit card
            </Button>
        </> : null}
        {props.showActionButtons ?
            <Button
                disabled={props.beingDeleted}
                size="sm"
                variant="outline-danger"
                className="mt-2 ms-1"
                onClick={() => props.onDeleteCard(props.cardWithCardSets.card)}
            >
                <DashCircle/> Delete card
            </Button> : null}
    </div>;
}

export default CardPreview;