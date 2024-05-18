import {apiClient} from "./ApiClient.js";
import {BaseResponse, BaseResponseData} from "./models/index.js";

export type GetVersionResponseData = BaseResponseData & {
    version: string;
}
export class GetVersionResponse extends BaseResponse {
    version: string;
    constructor(data: GetVersionResponseData) {
        super(data);
        this.version = data.version;
    }
}


export const getVersion = async() : Promise<GetVersionResponse> => {
    return await apiClient.get(GetVersionResponse, '/version');
}