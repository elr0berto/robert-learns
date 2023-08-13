import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData, CardSet, CardSetData} from "./models/index.js";

export type GetCardSetsRequest = {
    workspaceId: number;
}

export type GetCardSetsResponseData = BaseResponseData & {
    cardSetDatas: CardSetData[] | null;
}

export class GetCardSetsResponse extends BaseResponse {
    cardSets: CardSet[] | null;
    constructor(data: GetCardSetsResponseData) {
        super(data);
        this.cardSets = data.cardSetDatas?.map(csd => new CardSet(csd)) ?? null;
    }
}

export const getCardSets = async(request : GetCardSetsRequest) : Promise<GetCardSetsResponse> => {
    return await apiClient.post(GetCardSetsResponse, '/card-sets/get', request);
}


export type CreateCardSetResponseData = BaseResponseData & {
    cardSetData: CardSetData | null;
}

export class CreateCardSetResponse extends BaseResponse {
    cardSet: CardSet | null;
    constructor(data: CreateCardSetResponseData) {
        super(data);
        this.cardSet = data.cardSetData ? new CardSet(data.cardSetData) : null;
    }
}

export type CreateCardSetRequest = {
    cardSetId?: number;
    workspaceId: number;
    name: string;
    description: string;
}

export const validateCreateCardSetRequest = (req: CreateCardSetRequest) : string[] => {
    const errs : string[] = [];
    if (req.workspaceId <= 0) {
        errs.push('Workspace id is missing');
    }
    if (req.name.trim().length === 0) {
        errs.push('You must enter a name');
    }
    if (req.description.trim().length === 0) {
        errs.push('Please provide a description');
    }

    return errs;
}


export const createCardSet = async(req: CreateCardSetRequest) : Promise<CreateCardSetResponse> => {
    return await apiClient.post(CreateCardSetResponse, '/card-sets/create', req);
}

export type DeleteCardSetRequest = {
    cardSetId: number;
}

export const deleteCardSet = async(params: DeleteCardSetRequest) : Promise<BaseResponse> => {
    return await apiClient.post(BaseResponse, '/card-sets/delete-card-set', params);
}