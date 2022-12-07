import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {BaseResponse, BaseResponseData} from "./models/BaseResponse.js";


class ApiClient {
    onBeforeRequest: () => void = () => {};
    onAfterRequest: (response: BaseResponse) => void = () => {};
    axiosInstance: AxiosInstance = axios.default.create({
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

    async post<ResponseType extends BaseResponse, ResponseDataType extends BaseResponseData>(
        cls: {new (args: ResponseDataType): ResponseType;},
        url: string,
        data?: any,
        config?: AxiosRequestConfig | undefined) : Promise<ResponseType>
    {
        this.onBeforeRequest();
        const result = await this.axiosInstance.post<ResponseDataType>(url, data, config);
        const response = new cls(result.data);
        this.onAfterRequest(response);
        return response;
    }

    async get<ResponseType extends BaseResponse, ResponseDataType extends BaseResponseData>(
        cls: {new (args: ResponseDataType): ResponseType;},
        url: string,
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
