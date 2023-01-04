const CardSide = {
    FRONT: 'FRONT',
    BACK: 'BACK'
};

type CardSide = (typeof CardSide)[keyof typeof CardSide]

export type CardFaceData = {
    content: string | null;
    side: CardSide;
}

export class CardFace {
    content: string | null;
    side: CardSide;

    constructor(data: CardFaceData) {
        this.content = data.content;
        this.side = data.side;
    }
}