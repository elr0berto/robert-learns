import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData, CardSet, CardSetData} from "./models/index.js";

export type GetCardSetsRequest = {
    workspaceIds: number[];
}

export const validateGetCardSetsRequest = (req: GetCardSetsRequest) : string[] => {
    const errs : string[] = [];
    if (req.workspaceIds.length <= 0) {
        errs.push('Workspace ids is missing');
    }

    //  get unique workspace ids
    const uniqueWorkspaceIds = req.workspaceIds.filter((v, i, a) => a.indexOf(v) === i);
    if (uniqueWorkspaceIds.length !== req.workspaceIds.length) {
        errs.push('Workspace ids must be unique');
    }

    return errs;
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
    const errors = validateGetCardSetsRequest(request);
    if (errors.length !== 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetCardSetsResponse, '/card-sets/get-card-sets', request);
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
    const errors = validateCreateCardSetRequest(req);
    if (errors.length !== 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(CreateCardSetResponse, '/card-sets/create-card-set', req);
}

export type DeleteCardSetRequest = {
    cardSetId: number;
}

export const validateDeleteCardSetRequest = (req: DeleteCardSetRequest) : string[] => {
    const errs : string[] = [];
    if (req.cardSetId <= 0) {
        errs.push('Card set id is missing');
    }

    return errs;
}

export const deleteCardSet = async(params: DeleteCardSetRequest) : Promise<BaseResponse> => {
    const errors = validateDeleteCardSetRequest(params);
    if (errors.length !== 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(BaseResponse, '/card-sets/delete-card-set', params);
}


export type CardSetIdsPerCardSetIdKeyType = number;
export type CardSetIdsPerCardSetId = {
    [key in CardSetIdsPerCardSetIdKeyType as key]: number[];
};


export type UpdateCardSetsOrderRequest = {
    newSorting: CardSetIdsPerCardSetId;
}

export const validateUpdateCardSetsOrderRequest = (req: UpdateCardSetsOrderRequest) : string[] => {
    const errs : string[] = [];
    if (!req.newSorting || Object.keys(req.newSorting).length === 0) {
        errs.push('New sorting is missing');
    }

    if (!req.newSorting[0]) {
        errs.push('Root card set id is missing');
    }

    for(const parentId in req.newSorting) {
        const asInt = parseInt(parentId);
        if (isNaN(asInt)) {
            errs.push('Parent id ' + parentId + ' is not a number');
        }
        if (asInt < 0) {
            errs.push('Parent id ' + parentId + ' must be greater than or equal to 0');
        }
        if (req.newSorting[parentId].length === 0) {
            errs.push('Card set ids for parent id ' + parentId + ' is missing');
        }
        // check for duplicates
        const uniqueCardSetIds = req.newSorting[parentId].filter((v, i, a) => a.indexOf(v) === i);
        if (uniqueCardSetIds.length !== req.newSorting[parentId].length) {
            errs.push('Card set ids for parent id ' + parentId + ' must be unique');
        }
    }

    return errs;
}

export const updateCardSetsOrder = async(req: UpdateCardSetsOrderRequest) : Promise<BaseResponse> => {
    const errors = validateUpdateCardSetsOrderRequest(req);
    if (errors.length !== 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(BaseResponse, '/card-sets/update-card-sets-order', req);
}