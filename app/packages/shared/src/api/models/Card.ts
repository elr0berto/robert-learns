export type CardData = {
    id: number;
    front: string;
    back: string;
    audio: Media | null;
}

export default class Card {
    id: number;
    name: string;

    constructor(data: CardData) {
        this.id = data.id;
        this.name = data.name;
        this.cards = data.cards.map(c => new Card(c));
    }
}