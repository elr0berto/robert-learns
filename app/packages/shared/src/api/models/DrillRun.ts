import { DataType } from "./BaseResponse.js";

export type DrillRunData = DataType & {
    id: number;
    drillId: number;
    startTime: string;
    endTime: string | null;
    isLimited: boolean;
}

export class DrillRun {
    id: number;
    drillId: number;
    startTime: string;
    endTime: string | null;
    isLimited: boolean;

    constructor(data: DrillRunData) {
        this.id = data.id;
        this.drillId = data.drillId;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.isLimited = data.isLimited;
    }
}