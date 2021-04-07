import { AxiosError, AxiosResponse } from "axios";

export const onResponseFulfilled = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const onResponseRejected = (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
    // error 500/ 400/ something==> show the message and extract it from the response.
    // and if somehow the error is 401 ( then we need to redirect it to login page as well.
    // hydra-response=>
};
