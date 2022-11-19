import Media, {MediaData} from "./Media";
import CardFace, {CardFaceData} from "./CardFace";

export type CardData = {
    id: number;
    front: CardFaceData;
    back: CardFaceData | null;
    audio: MediaData | null;
}

export default class Card {
    id: number;
    front: CardFace;
    back: CardFace | null;
    audio: Media | null;

    constructor(data: CardData) {
        this.id = data.id;
        this.front = new CardFace(data.front);
        this.back = data.back === null ? null : new CardFace(data.back);
        this.audio = data.audio === null ? null : new Media(data.audio);
    }
}