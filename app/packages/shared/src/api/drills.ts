import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {Drill, DrillCardSet, DrillCardSetData, DrillData} from "./models/index.js";

export type CreateDrillResponseData = BaseResponseData & {
    drillData: DrillData | null;
    drillCardSetDatas: DrillCardSetData[] | null;
}

export class CreateDrillResponse extends BaseResponse {
    drill: Drill | null;
    drillCardSets: DrillCardSet[] | null;
    constructor(data: CreateDrillResponseData) {
        super(data);
        this.drill = data.drillData ? new Drill(data.drillData) : null;
        this.drillCardSets = data.drillCardSetDatas?.map(dcs => new DrillCardSet(dcs)) ?? null;
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

export type GetDrillsRequest = {
    drillIds?: number[];
}

export const validateGetDrillsRequest = (req: GetDrillsRequest) : string[] => {
    // check that drillIds have values
    if (req.drillIds === undefined) {
        return [];
    }

    const errs : string[] = [];
    if (req.drillIds.length === 0) {
        errs.push('Please select at least one drill or set null');
    }

    // check that req.drillIds are all positive numbers
    for (const drillId of req.drillIds) {
        if (drillId <= 0) {
            errs.push('Invalid drill id, should be positive number');
        }
    }

    // check that drillIds are all unique
    const uniqueDrillIds = [...new Set(req.drillIds)];
    if (uniqueDrillIds.length !== req.drillIds.length) {
        errs.push('Duplicate drill ids');
    }

    return errs;
}
export const getDrills = async(params : GetDrillsRequest) : Promise<GetDrillsResponse> => {
    const errors = validateGetDrillsRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetDrillsResponse, '/drills/get-drills', params);
}

export type DeleteDrillRequest = {
    drillId: number;
}

export const deleteDrill = async(params: DeleteDrillRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/drills/delete-drill', params);
}