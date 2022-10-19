import {BaseResponse, BaseResponseData} from "./BaseResponse";
import CardSet, {CardSetData} from "./CardSet";

export type WorkspaceCardSetListResponseData = BaseResponseData & {
    cardSets: CardSetData[] | null;
}

export class WorkspaceCardSetListResponse extends BaseResponse {
    cardSets: CardSet[];
    constructor(data: WorkspaceCardSetListResponseData) {
        super(data);
        this.cardSets = data.cardSets?.map(csd => new CardSet(csd)) ?? [];
    }
}