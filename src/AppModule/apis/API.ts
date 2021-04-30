import Axios, {
    AxiosRequestConfig,
    AxiosResponse,
    CancelTokenSource,
} from "axios";
import { axios } from "../config/axios";
import { RequestParamsType, RequestPayloadDataType } from "../models";

export abstract class API {
    protected static async makeGet<R>(
        url: string,
        params: RequestParamsType = {},
        config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<R>> {
        return axios.get<R>(url, {
            ...config,
            params,
        });
    }

    protected static async makePost<R, P>(
        url: string,
        data: RequestPayloadDataType | P,
        params: RequestParamsType = {},
        config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<R>> {
        return axios.post<R>(url, data, {
            ...config,
            params,
        });
    }

    protected static async makeDelete<R>(
        url: string,
        config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<R>> {
        return axios.delete<R>(url, config);
    }

    protected static async makePut<R, P>(
        url: string,
        data: RequestPayloadDataType | P,
        params: RequestParamsType = {},
        config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<R>> {
        return axios.put<R>(url, data, {
            ...config,
            params,
        });
    }

    protected static async makePatch<R, P>(
        url: string,
        data: RequestPayloadDataType | P | string,
        params: RequestParamsType = {},
        config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse<R>> {
        return axios.patch<R>(url, data, {
            ...config,
            params,
        });
    }

    public static createCancelTokenSource(): CancelTokenSource {
        return Axios.CancelToken.source();
    }
}
