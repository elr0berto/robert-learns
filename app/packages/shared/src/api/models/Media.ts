export type MediaData = {
    id: number;
    path: string;
    name: string;
}

export class Media {
    id: number;
    path: string;
    name: string;

    constructor(data: MediaData) {
        this.id = data.id;
        this.path = data.path;
        this.name = data.name;
    }

    public getUrl() : string {
        return this.path;
    }
}