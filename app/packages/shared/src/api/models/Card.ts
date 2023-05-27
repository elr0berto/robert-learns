import {Media,MediaData} from "./Media.js";
import {CardFace,CardFaceData} from "./CardFace.js";
import { DataType } from "./BaseResponse.js";
import {CardSet, CardSetData} from "./CardSet.js";


export type CardData = DataType & {
    id: number;
    front: CardFaceData;
    back: CardFaceData;
    audioData: MediaData | null;
    cardSetDatas: CardSetData[];
}

export class Card {
    id: number;
    front: CardFace;
    back: CardFace;
    audio: Media | null;
    cardSets: CardSet[];

    constructor(data: CardData) {
        this.id = data.id;
        this.front = new CardFace(data.front);
        this.back = new CardFace(data.back);
        this.audio = data.audioData === null ? null : new Media(data.audioData);
        this.cardSets = data.cardSetDatas.map((set) => new CardSet(set));
    }
}