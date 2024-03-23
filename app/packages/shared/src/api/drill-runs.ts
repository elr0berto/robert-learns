import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Drill, DrillData, DrillRun, DrillRunData, DrillRunQuestion, DrillRunQuestionData} from "./models/index.js";

export type CreateDrillRunResponseData = BaseResponseData & {
    drillRunData: DrillRunData | null;
}

export class CreateDrillRunResponse extends BaseResponse {
    drillRun: DrillRun | null;
    constructor(data: CreateDrillRunResponseData) {
        super(data);
        this.drillRun = data.drillRunData ? new DrillRun(data.drillRunData) : null;
    }
}


export type CreateDrillRunRequest = {
    drillId: number;
}

export const validateCreateDrillRunRequest = (req: CreateDrillRunRequest) : string[] => {
    const errs : string[] = [];
    if (req.drillId <= 0) {
        errs.push('Invalid drill id, should be positive number');
    }

    return errs;
}

export const createDrillRun = async(params: CreateDrillRunRequest) : Promise<CreateDrillRunResponse> => {
    const errors = validateCreateDrillRunRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(CreateDrillRunResponse, '/drill-runs/create-drill-run', params);
}

export type GetDrillRunsResponseData = BaseResponseData & {
    drillRunDatas: DrillRunData[] | null;
    drillDatas: DrillData[] | null;
    drillRunQuestionDatas: DrillRunQuestionData[] | null;
}

export class GetDrillRunsResponse extends BaseResponse {
    drillRuns: DrillRun[] | null;
    drills: Drill[] | null;
    drillRunQuestions: DrillRunQuestion[] | null;
    constructor(data: GetDrillRunsResponseData) {
        super(data);
        this.drillRuns = data.drillRunDatas ? data.drillRunDatas.map(d => new DrillRun(d)) : null;
        this.drills = data.drillDatas ? data.drillDatas.map(d => new Drill(d)) : null;
        this.drillRunQuestions = data.drillRunQuestionDatas ? data.drillRunQuestionDatas.map(d => new DrillRunQuestion(d)) : null;
    }
}

export type GetDrillRunsRequest = {
    drillRunIds: number[];
}

export const validateGetDrillRunsRequest = (req: GetDrillRunsRequest) : string[] => {
    // check that drillRunIds have values
    const errs : string[] = [];
    if (req.drillRunIds.length === 0) {
        errs.push('Please select at least one drill run');
    }

    // check that req.drillRunIds are all positive numbers
    for (const drillRunId of req.drillRunIds) {
        if (drillRunId <= 0) {
            errs.push('Invalid drill run id, should be positive number');
        }
    }

    // check that drillRunIds are all unique
    const uniqueDrillRunIds = [...new Set(req.drillRunIds)];
    if (uniqueDrillRunIds.length !== req.drillRunIds.length) {
        errs.push('Duplicate drill run ids');
    }

    return errs;
}
export const getDrillRuns = async(params: GetDrillRunsRequest) : Promise<GetDrillRunsResponse> => {
    const errors = validateGetDrillRunsRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }

    return await apiClient.post(GetDrillRunsResponse, '/drill-runs/get-drill-runs', params);
}

export type AnswerDrillRunQuestionRequest = {
    drillRunQuestionId: number;
    correct: boolean;
}

export const validateAnswerDrillRunQuestionRequest = (req: AnswerDrillRunQuestionRequest) : string[] => {
    const errs : string[] = [];
    if (req.drillRunQuestionId <= 0) {
        errs.push('Invalid drill run question id, should be positive number');
    }

    if (typeof req.correct !== "boolean") {
        errs.push('Please specify whether the answer was correct or not');
    }

    return errs;
}

export const answerDrillRunQuestion = async(params: AnswerDrillRunQuestionRequest) : Promise<BaseResponse> => {
    const errors = validateAnswerDrillRunQuestionRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }

    return await apiClient.post(BaseResponse, '/drill-runs/answer-drill-run-question', params);
}