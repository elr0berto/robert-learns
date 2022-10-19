export type MediaData = {
    id: number;
    data: string;
    name: string;
}

export default class Media {
    id: number;
    data: string;
    name: string;

    constructor(data: MediaData) {
        this.id = data.id;
        this.data = data.data;
        this.name = data.name;
    }
}