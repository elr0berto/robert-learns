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
    drillId: number | null;
    name: string;
    description: string;
    cardSetIds: number[];
}

export const validateCreateDrillRequest = (req: CreateDrillRequest) : string[] => {
    const errs : string[] = [];
    if (req.drillId !== null && req.drillId <= 0) {
        errs.push('Invalid drill id, should be null or positive number');
    }
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }
    if (req.cardSetIds.length === 0) {
        errs.push('Please select at least one card set');
    }

    // check that req.cardSetIds are all positive numbers
    for (const cardSetId of req.cardSetIds) {
        if (cardSetId <= 0) {
            errs.push('Invalid card set id, should be positive number');
        }
    }

    // check that req.cardSetIds are all unique
    const uniqueCardSetIds = [...new Set(req.cardSetIds)];
    if (uniqueCardSetIds.length !== req.cardSetIds.length) {
        errs.push('Duplicate card set ids');
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