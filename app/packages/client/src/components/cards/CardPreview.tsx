import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import AudioPlayer from "react-h5-audio-player";
import CardPreviewFace from "./CardPreviewFace";
import {Button} from "react-bootstrap";
import {DashCircle, PencilSquare} from "react-bootstrap-icons";
import CardCardSetsPreview from "./CardCardSetsPreview";

type Props = {
    card: Card;
    onDeleteCard: (card: Card) => void;
    onEditCard: (card: Card) => void;
    beingDeleted: boolean;
    showActionButtons: boolean;
    thisCardSetId?: number;
    showCardSetsPreview: boolean;
    onEditCardSets: (card: Card) => void;
}

function CardPreview(props: Props) {
    return <div className="card-preview border p-2">
        <CardPreviewFace content={props.card.front?.content ?? ''}/>
        <hr/>
        <CardPreviewFace content={props.card.back?.content ?? ''}/>
        {props.card.audio !== null ? <AudioPlayer
            src={props.card.audio.getUrl()}
            onPlay={e => console.log("onPlay")}
        /> : null}
        <hr/>
        {props.showCardSetsPreview ? <CardCardSetsPreview showEditButton={props.showActionButtons} thisCardSetId={props.thisCardSetId} card={props.card} onEdit={props.onEditCardSets}/> : null}
        <hr/>
        {props.showActionButtons ? <Button size="sm" variant="outline-primary" className="mt-2" onClick={() => props.onEditCard(props.card)}><PencilSquare/> Edit</Button> : null}
        {props.showActionButtons ? <Button disabled={props.beingDeleted} size="sm" variant="outline-danger" className="mt-2 ms-1" onClick={() => props.onDeleteCard(props.card)}><DashCircle/> Delete</Button> : null}
    </div>;
}

export default CardPreview;