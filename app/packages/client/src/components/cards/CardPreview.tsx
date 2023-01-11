import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import AudioPlayer from "react-h5-audio-player";
import CardPreviewFace from "./CardPreviewFace";
import {Button} from "react-bootstrap";
import {DashCircle, PencilSquare} from "react-bootstrap-icons";

type Props = {
    card: Card;
    onDeleteCard: (card: Card) => void;
}

function CardPreview(props: Props) {
    return <div className="card-preview border p-2">
        <CardPreviewFace content={props.card.front.content}/>
        <hr/>
        <CardPreviewFace content={props.card.back.content}/>
        {props.card.audio !== null ? <AudioPlayer
            src={props.card.audio.getUrl()}
            onPlay={e => console.log("onPlay")}
        /> : null}
        <Button size="sm" variant="outline-primary" className="mt-2"><PencilSquare/> Edit</Button>
        <Button size="sm" variant="outline-danger" className="mt-2 ms-1" onClick={() => props.onDeleteCard(props.card)}><DashCircle/> Delete</Button>
    </div>;
}

export default CardPreview;