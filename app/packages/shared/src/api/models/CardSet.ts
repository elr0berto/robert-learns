import { DataType } from "./BaseResponse.js";

export type CardSetData = DataType & {
    id: number;
    name: string;
    description: string;
    workspaceId: number;
}

export class CardSet {
    id: number;
    name: string;
    description: string;
    workspaceId: number;

    constructor(data: CardSetData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.workspaceId = data.workspaceId;
    }
}