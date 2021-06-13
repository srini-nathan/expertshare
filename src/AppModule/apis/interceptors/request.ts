import { AxiosRequestConfig } from "axios";
import { AUTH_TOKEN_KEY, USER_LOCALE } from "../../config/app-env";
import { generateKeyHeader, getUserTimeZone } from "../../utils/api";

export const onRequestFulfilled = (
    config: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    // eslint-disable-next-line no-console,no-param-reassign
    config.headers["ES-KEY"] = generateKeyHeader();
    config.headers["ES-TIMEZONE"] = getUserTimeZone();
    // @TODO: why we need this, ask daniel ?
    config.headers["Content-Type"] = "application/ld+json";

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
    }

    const locale = localStorage.getItem(USER_LOCALE);
    // eslint-disable-next-line @typescript-eslint/dot-notation, no-console,no-param-reassign
    config.params["locale"] = locale;
    return config;
};

export const onRequestRejected = (error: any): null => {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
};
