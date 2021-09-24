import { AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "../../AppModule/apis/API";
import { ROUTES, route } from "../../config";
import { checkAndParseResponse } from "../../AppModule/utils/api";
import {
    UnprocessableEntityErrorResponse,
    SimpleObject,
    User,
} from "../../AppModule/models";

const {
    api_users_me_collection: API_ME,
    api_reset_password_request_collection: API_RESET_PASSWORD_REQUEST,
    api_reset_password_collection: API_RESET_PASSWORD,
    api_security_get_token: API_SECURITY_GET_TOKEN,
    api_security_otp_send: API_SECURITY_OTP_SEND,
    api_security_otp_check: API_SECURITY_OTP_CHECK,
} = ROUTES;

// @TODO: Missing URL from routes.json
const API_LOGIN_CHECK = "/login_check";

export interface LoginResponse {
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ErrorResponse {
    violations: SimpleObject<string>;
    title: string;
    description: string;
}

export class AuthApi extends API {
    static async handleError<R>(data: R): Promise<ErrorResponse> {
        const errorResponse = new UnprocessableEntityErrorResponse();
        const parsedData: SimpleObject<any> = checkAndParseResponse(data);
        if (parsedData["hydra:title"]) {
            errorResponse.title = parsedData["hydra:title"];
        }

        if (parsedData["hydra:description"]) {
            errorResponse.description = parsedData["hydra:description"];
        }

        if (parsedData.violations) {
            errorResponse.setViolations(parsedData.violations);
        }
        return errorResponse;
    }

    static async login(credentials: LoginPayload): Promise<LoginResponse> {
        const res: AxiosResponse<LoginResponse> = await this.makePost<
            LoginResponse,
            LoginPayload
        >(API_LOGIN_CHECK, credentials);
        return res.data;
    }

    static async resetPasswordRequest<T, R>(
        credentials: T
    ): Promise<R | ErrorResponse> {
        return this.makePost<R, T>(API_RESET_PASSWORD_REQUEST, credentials)
            .then((res) => {
                return res.data;
            })
            .catch(({ response }) => {
                return this.handleError<R>(response.data);
            });
    }

    static async resetPassword<T, R>(
        credentials: T
    ): Promise<R | ErrorResponse> {
        return this.makePost<R, T>(API_RESET_PASSWORD, credentials)
            .then((res) => {
                return res.data;
            })
            .catch(({ response }) => {
                return this.handleError<R>(response.data);
            });
    }

    public static async me(config: AxiosRequestConfig = {}): Promise<User> {
        const res: AxiosResponse<User> = await this.makeGet<User>(
            API_ME,
            {},
            config
        );
        return res.data;
    }

    // @TODO: move it to another API class, that is more related to it
    static async checkAndGetToken<R>(
        containerId: number
    ): Promise<R | ErrorResponse> {
        return this.makeGet<R>(
            route(API_SECURITY_GET_TOKEN, {
                containerId,
            })
        )
            .then((res) => {
                return res.data;
            })
            .catch(({ response }) => {
                return this.handleError<R>(response.data);
            });
    }

    static async sendOtp<P, R>(
        payload: P,
        config: AxiosRequestConfig = {}
    ): Promise<R | ErrorResponse> {
        return this.makePost<R, P>(API_SECURITY_OTP_SEND, payload, {}, config)
            .then((res) => {
                return res.data;
            })
            .catch(({ response }) => {
                return this.handleError<R>(response.data);
            });
    }

    static async checkOtp<P, R>(
        payload: P,
        config: AxiosRequestConfig = {}
    ): Promise<R | ErrorResponse> {
        return this.makePost<R, P>(API_SECURITY_OTP_CHECK, payload, {}, config)
            .then((res) => {
                return res.data;
            })
            .catch(({ response }) => {
                return this.handleError<R>(response.data);
            });
    }
}
