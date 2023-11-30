import { DataType } from "./BaseResponse.js";

export type DrillData = DataType & {
    id: number;
    name: string;
    description: string;
}

export class Drill {
    id: number;
    name: string;
    description: string;

    constructor(data: DrillData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }
}