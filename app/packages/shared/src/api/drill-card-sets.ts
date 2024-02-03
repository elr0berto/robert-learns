import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";
import {DrillCardSet, DrillCardSetData} from "./models/DrillCardSet.js";

export type GetDrillCardSetsResponseData = BaseResponseData & {
    drillCardSetDatas: DrillCardSetData[] | null;
}

export class GetDrillCardSetsResponse extends BaseResponse {
    drillCardSets: DrillCardSet[] | null;
    constructor(data: GetDrillCardSetsResponseData) {
        super(data);
        this.drillCardSets = data.drillCardSetDatas?.map(cs => new DrillCardSet(cs)) ?? null;
    }
}

export type GetDrillCardSetsRequest = {
    drillIds: number[];
}

export const validateGetDrillCardSetsRequest = (req: GetDrillCardSetsRequest) : string[] => {
    const errs : string[] = [];

    if (req.drillIds.length === 0) {
        errs.push('You must provide at least one drill id');
    }

    // check that req.drillIds are all positive numbers
    for (const drillId of req.drillIds) {
        if (drillId <= 0) {
            errs.push('Invalid drill id, should be positive number');
        }
    }

    // check that req.drillIds are all unique
    const uniqueDrillIds = [...new Set(req.drillIds)];
    if (uniqueDrillIds.length !== req.drillIds.length) {
        errs.push('Duplicate drill ids');
    }

    return errs;
}

export const getDrillCardSets = async(params: GetDrillCardSetsRequest) : Promise<GetDrillCardSetsResponse> => {
    const errors = validateGetDrillCardSetsRequest(params);
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetDrillCardSetsResponse, '/drill-card-sets/get-drill-card-sets', params);
}