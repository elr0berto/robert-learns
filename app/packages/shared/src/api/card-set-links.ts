import {apiClient} from './ApiClient.js';
import {BaseResponse, BaseResponseData, CardSetLink, CardSetLinkData} from "./models/index.js";

export type GetCardSetLinksRequest = {
    cardSetIds: number[];
}

export const validateGetCardSetLinksRequest = (req: GetCardSetLinksRequest) : string[] => {
    const errs : string[] = [];
    if (req.cardSetIds.length <= 0) {
        errs.push('cardSetIds ids is missing');
    }

    //  get unique workspace ids
    const unique = req.cardSetIds.filter((v, i, a) => a.indexOf(v) === i);
    if (unique.length !== req.cardSetIds.length) {
        errs.push('cardSetIds must be unique');
    }

    return errs;
}


export type GetCardSetLinksResponseData = BaseResponseData & {
    cardSetLinkDatas: CardSetLinkData[] | null;
}

export class GetCardSetLinksResponse extends BaseResponse {
    cardSetLinks: CardSetLink[] | null;
    constructor(data: GetCardSetLinksResponseData) {
        super(data);
        this.cardSetLinks = data.cardSetLinkDatas?.map(csd => new CardSetLink(csd)) ?? null;
    }
}

export const getCardSetLinks = async(request : GetCardSetLinksRequest) : Promise<GetCardSetLinksResponse> => {
    const errors = validateGetCardSetLinksRequest(request);
    if (errors.length !== 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(GetCardSetLinksResponse, '/card-set-links/get-card-set-links', request);
}

export type SetCardSetLinksRequest = {
    parentCardSetId: number;
    cardSetIds: number[];
}

export const validateSetCardSetLinksRequest = (req: SetCardSetLinksRequest) : string[] => {
    const errs : string[] = [];
    if (req.parentCardSetId <= 0) {
        errs.push('parentCardSetId is missing');
    }

    //  get unique workspace ids
    const unique = req.cardSetIds.filter((v, i, a) => a.indexOf(v) === i);
    if (unique.length !== req.cardSetIds.length) {
        errs.push('cardSetIds must be unique');
    }

    return errs;
}

export type SetCardSetLinksResponseData = BaseResponseData & {
    cardSetLinkDatas: CardSetLinkData[] | null;
}

export class SetCardSetLinksResponse extends BaseResponse {
    cardSetLinks: CardSetLink[] | null;
    constructor(data: SetCardSetLinksResponseData) {
        super(data);
        this.cardSetLinks = data.cardSetLinkDatas?.map(csd => new CardSetLink(csd)) ?? null;
    }
}

export const setCardSetLinks = async(request : SetCardSetLinksRequest) : Promise<SetCardSetLinksResponse> => {
    const errors = validateSetCardSetLinksRequest(request);
    if (errors.length !== 0) {
        throw new Error(errors.join('\n'));
    }
    return await apiClient.post(SetCardSetLinksResponse, '/card-set-links/set-card-set-links', request);
}
