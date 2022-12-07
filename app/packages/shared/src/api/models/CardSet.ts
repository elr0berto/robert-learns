export type CardSetData = {
    id: number;
    name: string;
}

export class CardSet {
    id: number;
    name: string;

    constructor(data: CardSetData) {
        this.id = data.id;
        this.name = data.name;
    }
}