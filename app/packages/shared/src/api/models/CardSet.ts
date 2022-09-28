export type CardSetData = {
    id: number;
    name: string;
    cards: CardData[];
}

export default class CardSet {
    id: number;
    name: string;
    cards: Card[];

    constructor(data: CardSetData) {
        this.id = data.id;
        this.name = data.name;
        this.cards = data.cards.map(c => new Card(c));
    }
}