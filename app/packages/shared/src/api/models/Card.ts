import Media, {MediaData} from "./Media";

export type CardData = {
    id: number;
    front: string;
    back: string;
    audio: MediaData | null;
}

export default class Card {
    id: number;
    front: string;
    back: string;
    audio: Media | null;

    constructor(data: CardData) {
        this.id = data.id;
        this.front = data.front;
        this.back = data.back;
        this.audio = data.audio === null ? null : new Media(data.audio);
    }
}