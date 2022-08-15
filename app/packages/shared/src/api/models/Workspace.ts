export type WorkspaceData = {
    id: number;
    name: string;
}

export default class Workspace {
    id: number;
    name: string;

    constructor(data: WorkspaceData) {
        this.id = data.id;
        this.name = data.name;
    }
}