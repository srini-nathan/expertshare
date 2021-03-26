import { AxiosError, AxiosResponse } from "axios";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    // eslint-disable-next-line no-console
    console.log(response, "response");
    return response;
};

export const onResponseRejected = (error: AxiosError): any => {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
};
