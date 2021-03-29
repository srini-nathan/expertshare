import { default as Axios, AxiosRequestConfig, AxiosInstance } from "axios";
import  { API_HOST } from "./app-env";
import { onRequestFulfilled, onRequestRejected } from "../apis/interceptors/request";
import { onResponseFulfilled, onResponseRejected } from "../apis/interceptors/response";
import { ACCEPTABLE_RESPONSE } from "../config/app-env";
import { AcceptableResponse } from "../models";

const defaultConfig: AxiosRequestConfig = {
    baseURL: API_HOST,
    timeout: 1000 * 60,
    headers: {
        accept: AcceptableResponse.header(ACCEPTABLE_RESPONSE),
    }
}

Axios.defaults = { ...Axios.defaults, ...defaultConfig };

export let axios: AxiosInstance;

export const createAxios = (configuration: AxiosRequestConfig): AxiosInstance => {
    return Axios.create(configuration);
}

export const init = (): void => {
    axios = createAxios(defaultConfig);
    axios.interceptors.request.use(onRequestFulfilled, onRequestRejected)
    axios.interceptors.response.use(onResponseFulfilled, onResponseRejected)
}