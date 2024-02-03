import { DataType } from "./BaseResponse.js";

export type DrillCardSetData = DataType & {
    drillId: number;
    cardSetId: number;
}

export class DrillCardSet {
    drillId: number;
    cardSetId: number;

    constructor(data: DrillCardSetData) {
        this.drillId = data.drillId;
        this.cardSetId = data.cardSetId;
    }
}