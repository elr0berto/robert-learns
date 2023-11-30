import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Drill, DrillData} from "./models/index.js";

export type CreateDrillResponseData = BaseResponseData & {
    drillData: DrillData | null;
}

export class CreateDrillResponse extends BaseResponse {
    drill: Drill | null;
    constructor(data: CreateDrillResponseData) {
        super(data);
        this.drill = data.drillData ? new Drill(data.drillData) : null;
    }
}


export type CreateDrillRequest = {
    drillId?: number;
    name: string;
    description: string;
}

export const validateCreateDrillRequest = (req: CreateDrillRequest) : string[] => {
    const errs : string[] = [];
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }

    return errs;
}

export const createDrill = async(params: CreateDrillRequest) : Promise<CreateDrillResponse> => {
    const errors = validateCreateDrillRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(CreateDrillResponse, '/drills/create-drill', params);
}

export type GetDrillsResponseData = BaseResponseData & {
    drillDatas: DrillData[] | null;
}

export class GetDrillsResponse extends BaseResponse {
    drills: Drill[] | null;
    constructor(data: GetDrillsResponseData) {
        super(data);
        this.drills = data.drillDatas?.map(dd => new Drill(dd)) ?? null;
    }
}

export const getDrills = async() : Promise<GetDrillsResponse> => {
    return await apiClient.post(GetDrillsResponse, '/drills/get-drills');
}

export type DeleteDrillRequest = {
    drillId: number;
}

export const deleteDrill = async(params: DeleteDrillRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/drills/delete-drill', params);
}