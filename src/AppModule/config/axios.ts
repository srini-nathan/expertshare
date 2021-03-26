import { default as Axios, AxiosRequestConfig, AxiosInstance } from "axios";
import  { API_HOST } from "./app-env";
import { onRequestFulfilled, onRequestRejected } from "../apis/interceptors/request";


const config: AxiosRequestConfig = {
    baseURL: API_HOST,
    timeout: 1000 * 60,
    headers: {
        accept: "application/json",
    },
}

Axios.defaults = { ...Axios.defaults, ...config };

export let axios: AxiosInstance;

export const createAxios = (configuration: AxiosRequestConfig): AxiosInstance => {
    return Axios.create(configuration);
}

export const init = (): void => {
    axios = createAxios(config);
    axios.interceptors.request.use(onRequestFulfilled, onRequestRejected)
}