import { AxiosRequestConfig } from "axios";
import { AUTH_TOKEN_KEY } from "../../config/app-env";

export const onRequestFulfilled = (
    config: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

export const onRequestRejected = (error: any): null => {
    // eslint-disable-next-line no-console
    console.log(error.response);
    // eslint-disable-next-line no-console
    console.error("onRequestRejected", error);
    return null;
};
