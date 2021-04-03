import { AxiosError, AxiosResponse } from "axios";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
};
