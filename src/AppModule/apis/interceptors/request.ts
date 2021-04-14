import { AxiosRequestConfig } from "axios";
import { AUTH_TOKEN_KEY } from "../../config/app-env";
import { generateKeyHeader } from "../../utils/api";

export const onRequestFulfilled = (
    config: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    // eslint-disable-next-line no-console,no-param-reassign
    config.headers["ES-KEY"] = generateKeyHeader();

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

export const onRequestRejected = (error: any): null => {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
};
