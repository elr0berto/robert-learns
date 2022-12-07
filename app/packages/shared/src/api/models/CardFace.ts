import {Media,MediaData} from "./Media.js";

const CardSide = {
    FRONT: 'FRONT',
    BACK: 'BACK'
};

type CardSide = (typeof CardSide)[keyof typeof CardSide]

export type CardFaceData = {
    content: string | null;
    side: CardSide;
    media: MediaData | null;
}

export class CardFace {
    content: string | null;
    side: CardSide;
    media: Media | null;

    constructor(data: CardFaceData) {
        this.content = data.content;
        this.side = data.side;
        this.media = data.media === null ? null : new Media(data.media);
    }
}