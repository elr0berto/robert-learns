import {DataType} from "./BaseResponse.js";

export type LogEntryData = DataType & {
    id: number;
    timestamp: string;
    level: string;
    message: string;
}

export class LogEntry {
    id: number;
    timestamp: string;
    level: string;
    message: string;
    constructor(data: LogEntryData) {
        this.id = data.id;
        this.timestamp = data.timestamp;
        this.level = data.level;
        this.message = data.message;
    }
}