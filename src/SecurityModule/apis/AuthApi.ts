import { AxiosResponse } from "axios";
import { API } from "../../AppModule/apis/API";

export interface LoginResponse {
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export class AuthApi extends API {
    static async login(credentials: LoginPayload): Promise<LoginResponse> {
        const res: AxiosResponse<LoginResponse> = await this.makePost<
            LoginResponse,
            LoginPayload
        >("/login_check", credentials);
        return res.data;
    }
}
