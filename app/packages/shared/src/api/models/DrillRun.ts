import { DataType } from "./BaseResponse.js";

export type DrillRunData = DataType & {
    id: number;
    drillId: number;
    startTime: string;
    endTime: string | null;
}

export class DrillRun {
    id: number;
    drillId: number;
    startTime: string;
    endTime: string | null;

    constructor(data: DrillRunData) {
        this.id = data.id;
        this.drillId = data.drillId;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
    }
}