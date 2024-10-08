import { DataType } from "./BaseResponse.js";

export type DrillRunQuestionData = DataType & {
    id: number;
    drillRunId: number;
    cardId: number;
    order: number;
    correct: boolean | null;
    answeredAt: string | null;
}

export class DrillRunQuestion {
    id: number;
    drillRunId: number;
    cardId: number;
    order: number;
    correct: boolean | null;
    answeredAt: string | null;
    constructor(data: DrillRunQuestionData) {
        this.id = data.id;
        this.drillRunId = data.drillRunId;
        this.cardId = data.cardId;
        this.order = data.order;
        this.correct = data.correct;
        this.answeredAt = data.answeredAt;
    }
}