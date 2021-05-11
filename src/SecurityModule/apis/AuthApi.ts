import { AxiosResponse } from "axios";
import { API } from "../../AppModule/apis/API";
import { ROUTES } from "../../config";
import { checkAndParseResponse } from "../../AppModule/utils/api";
import {
    UnprocessableEntityErrorResponse,
    SimpleObject,
} from "../../AppModule/models";

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
        >("/login_check", credentials);
        return res.data;
    }

    static async resetPasswordRequest<T, R>(
        credentials: T
    ): Promise<R | ErrorResponse> {
        return this.makePost<R, T>(
            ROUTES.api_reset_password_request_collection,
            credentials
        )
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
        return this.makePost<R, T>(
            ROUTES.api_reset_password_collection,
            credentials
        )
            .then((res) => {
                return res.data;
            })
            .catch(({ response }) => {
                return this.handleError<R>(response.data);
            });
    }
}
