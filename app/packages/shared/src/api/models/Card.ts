import {Media,MediaData} from "./Media.js";
import {CardFace,CardFaceData} from "./CardFace.js";

export type CardData = {
    id: number;
    front: CardFaceData;
    back: CardFaceData;
    audio: MediaData | null;
}

export class Card {
    id: number;
    front: CardFace;
    back: CardFace;
    audio: Media | null;

    constructor(data: CardData) {
        this.id = data.id;
        this.front = new CardFace(data.front);
        this.back = new CardFace(data.back);
        this.audio = data.audio === null ? null : new Media(data.audio);
    }
}