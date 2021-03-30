import { AxiosError, AxiosResponse } from "axios";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): null => {
    // eslint-disable-next-line no-console
    console.error("onResponseRejected", error);
    return null;
};
