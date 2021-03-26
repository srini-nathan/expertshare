import { AxiosResponse } from "axios";
import { API } from "../../AppModule/apis/API";

export interface Token {
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export class AuthApi extends API {
    static async login(
        email: string,
        password: string
    ): Promise<AxiosResponse<Token>> {
        return this.makePost<Token, LoginPayload>("/login_check", {
            email,
            password,
        });
    }
}
