import { AxiosError, AxiosResponse } from "axios";
import { navigate } from "@reach/router";
import { ServerError } from "../../models";
import { errorToast } from "../../utils";
import { clearAuthStorage } from "../../../SecurityModule/utils";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): Promise<any> => {
    const status = error.response?.status;
    const message =
        error.response?.data?.message ||
        error.response?.data["hydra:description"];
    // status code available
    if (status) {
        if (status === 401) {
            navigate("/auth/login", { state: {} }).then(() => {
                clearAuthStorage().then(() => {
                    // we don't need to show any message here, just kickout
                });
            });
        }
        if (status === 403) {
            errorToast("You are not suppose to be here!");
        }
        if (status >= 500 && status <= 599) {
            return Promise.reject(new ServerError(message));
        }
    }

    return Promise.reject(error);
};
