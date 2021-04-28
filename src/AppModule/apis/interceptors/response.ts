import { AxiosError, AxiosResponse } from "axios";
import { navigate } from "@reach/router";
import { sweetError } from "../../components/Util";
import { ServerError } from "../../models";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): Promise<any> => {
    const status = error.response?.status;

    // status code available
    if (status) {
        if (status === 401 || status === 403) {
            navigate("/auth/login", { state: {} });
            sweetError({
                text: "You need to login!",
            });
        }
        if (status >= 500 && status <= 599) {
            return Promise.reject(new ServerError());
        }
    }

    return Promise.reject(error);
};
