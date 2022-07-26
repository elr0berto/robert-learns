import {AxiosInstance, AxiosRequestConfig, default as axios} from "axios";
import {BaseResponse, BaseResponseData} from "./models/BaseResponse";
import {ClassConstructor, plainToInstance} from "class-transformer";

class ApiClient {
    onBeforeRequest: () => void = () => {};
    onAfterRequest: (response: BaseResponse) => void = () => {};
    axiosInstance: AxiosInstance = axios.create({
        baseURL: '/api',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
        },
    });

    initialize (onBeforeRequest: () => void, onAfterRequest: (response: BaseResponse) => void) {
        this.onBeforeRequest = onBeforeRequest;
        this.onAfterRequest = onAfterRequest;
    }

    async post<ResponseType extends BaseResponse>(cls: ClassConstructor<ResponseType>, url: string, data?: any, config?: AxiosRequestConfig | undefined) : Promise<ResponseType> {
        this.onBeforeRequest();
        const result = await this.axiosInstance.post<ResponseType>(url, data, config);
        const response = plainToInstance(cls, result.data);
        this.onAfterRequest(response);
        return response;
    }

    /*async get<ResponseType extends BaseResponse>(cls: ClassConstructor<ResponseType>, url: string, data?: any, config?: AxiosRequestConfig | undefined) : Promise<ResponseType> {
        this.onBeforeRequest();
        const result = await this.axiosInstance.get<ResponseType>(url, config);
        const response = plainToInstance(cls, result.data);
        this.onAfterRequest(response);
        return response;
    }*/

    async get<ResponseType extends BaseResponse, ResponseDataType extends BaseResponseData>(
        cls: {new (args: ResponseDataType): ResponseType;},
        url: string,
        data?: any,
        config?: AxiosRequestConfig | undefined) : Promise<ResponseType>
    {
        this.onBeforeRequest();
        const result = await this.axiosInstance.get<ResponseDataType>(url, config);
        const response = new cls(result.data);
        this.onAfterRequest(response);
        return response;
    }
}

export const apiClient = new ApiClient();
