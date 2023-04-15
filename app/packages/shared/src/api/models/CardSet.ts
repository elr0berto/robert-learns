export type CardSetData = {
    id: number;
    name: string;
    description: string;
}

export class CardSet {
    id: number;
    name: string;
    description: string;

    constructor(data: CardSetData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }
}