import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {DrillRun, DrillRunData} from "./models/index.js";

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
    drillId: number | null;
}

export const validateCreateDrillRunRequest = (req: CreateDrillRunRequest) : string[] => {
    const errs : string[] = [];
    if (req.drillId !== null && req.drillId <= 0) {
        errs.push('Invalid drill id, should be null or positive number');
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
