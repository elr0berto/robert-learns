export type CardData = {
    id: number;
    front: string;
    back: string;
    media: Media;
}

export default class Card {
    id: number;
    name: string;
    cards: Card[];

    constructor(data: CardData) {
        this.id = data.id;
        this.name = data.name;
        this.cards = data.cards.map(c => new Card(c));
    }
}