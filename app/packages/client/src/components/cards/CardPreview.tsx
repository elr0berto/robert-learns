import React from 'react';
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import AudioPlayer from "react-h5-audio-player";
import CardPreviewFace from "./CardPreviewFace";

type Props = {
    card: Card;
}

function CardPreview(props: Props) {
    return <div className="card-preview">
        <CardPreviewFace content={props.card.front.content}/>
        <CardPreviewFace content={props.card.back.content}/>
        {props.card.audio !== null ? <AudioPlayer
            src={props.card.audio.getUrl()}
            onPlay={e => console.log("onPlay")}
        /> : null}
    </div>;
}

export default CardPreview;