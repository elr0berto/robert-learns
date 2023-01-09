export type MediaData = {
    id: number;
    name: string;
}

export class Media {
    id: number;
    name: string;

    constructor(data: MediaData) {
        this.id = data.id;
        this.name = data.name;
    }

    public getUrl() : string {
        return '/api/media/'+this.id+'/'+this.name;
    }
}