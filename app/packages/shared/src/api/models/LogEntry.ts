import {DataType} from "./BaseResponse.js";

export type LogEntryData = DataType & {
    id: number;
    timestamp: string;
    level: string;
    message: string;
    meta: string | null;
}

export class LogEntry {
    id: number;
    timestamp: string;
    level: string;
    message: string;
        meta: string | null;

    constructor(data: LogEntryData) {
        this.id = data.id;
        this.timestamp = data.timestamp;
        this.level = data.level;
        this.message = data.message;
        this.meta = data.meta;
    }
}