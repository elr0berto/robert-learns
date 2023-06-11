import { DataType } from "./BaseResponse.js";

export type WorkspaceData = DataType & {
    id: number;
    name: string;
    description: string;
    allowGuests: boolean;
}

export class Workspace {
    id: number;
    name: string;
    description: string;
    allowGuests: boolean;

    constructor(data: WorkspaceData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.allowGuests = data.allowGuests;
    }
}