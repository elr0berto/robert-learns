import {apiClient} from './ApiClient';
import {BaseResponse} from "./response";
import User from "./models/User";
import {Type} from "class-transformer";

class LoginCheckResponse extends BaseResponse {
    User!: User;
}

export const LoginCheck = async () : Promise<LoginCheckResponse> => {
    return await apiClient.post(LoginCheckResponse, '/login/check', {});
};

