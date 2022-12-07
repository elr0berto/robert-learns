export type WorkspaceData = {
    id: number;
    name: string;
    description: string;
}

export class Workspace {
    id: number;
    name: string;
    description: string;
    constructor(data: WorkspaceData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }
}