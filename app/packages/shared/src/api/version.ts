import {apiClient} from "./ApiClient.js";
import {BaseResponse, BaseResponseData} from "./models/index.js";

export type GetVersionResponseData = BaseResponseData & {
    version: string;
    versionShared: string;
}
export class GetVersionResponse extends BaseResponse {
    version: string;
    versionShared: string;
    constructor(data: GetVersionResponseData) {
        super(data);
        this.version = data.version;
        this.versionShared = data.versionShared;
    }
}


export const getVersion = async() : Promise<GetVersionResponse> => {
    return await apiClient.get(GetVersionResponse, '/version');
}