import { AxiosError, AxiosResponse } from "axios";
import { navigate } from "@reach/router";
import { sweetError } from "../../components/Util";
import { ServerError, UnprocessableEntityError } from "../../models";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): Promise<any> => {
    const status = error.response?.status;

    // status code available
    if (status) {
        if (status === 401) {
            return navigate("/auth/login").then(() => {
                sweetError({
                    text: "You need to login!",
                });
            });
        }
        if (status === 422) {
            return Promise.reject(new UnprocessableEntityError());
        }
        if (status >= 500 && status <= 599) {
            return Promise.reject(new ServerError());
        }
    }

    return Promise.reject(error);
};
