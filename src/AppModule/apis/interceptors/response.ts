import { AxiosError, AxiosResponse } from "axios";
import { navigate } from "@reach/router";
import { ServerError } from "../../models";
import { errorToast } from "../../utils";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): Promise<any> => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // status code available
    if (status) {
        if (status === 401 || status === 403) {
            navigate("/auth/login", { state: {} }).then(() => {
                if (message) {
                    errorToast(message);
                } else {
                    errorToast("You need to login!");
                }
            });
        }
        if (status >= 500 && status <= 599) {
            return Promise.reject(new ServerError());
        }
    }

    return Promise.reject(error);
};
