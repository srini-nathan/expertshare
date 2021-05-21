import { AxiosError } from "axios";
import { API } from "./API";
import { ACCEPTABLE_RESPONSE } from "../config/app-env";
import {
    AcceptableResponse,
    FinalResponse,
    ServerError,
    SimpleObject,
} from "../models";
import {
    onAddEditErrorResponseHydra,
    onAddEditErrorResponseJson,
} from "./transformer";

export abstract class UploadAPI extends API {
    protected static acceptHydra = AcceptableResponse.isHydra(
        ACCEPTABLE_RESPONSE
    );

    protected static POST_RESOURSE = "/api/uploads";

    protected static GET_RESOURSE = "/api/uploads/{id}";

    protected static DELETE_RESOURSE = "/api/uploads/{id}";

    protected static handleErrorDuringCreatingOrUpdating(
        error: AxiosError | ServerError
    ): Promise<FinalResponse<null>> {
        const { message } = error;

        if (error instanceof ServerError) {
            return Promise.resolve(new FinalResponse(null, message));
        }

        const { response } = error as AxiosError;
        if (response) {
            const { status, data } = response;
            if (status === 422) {
                return Promise.resolve(
                    new FinalResponse(
                        null,
                        this.acceptHydra
                            ? onAddEditErrorResponseHydra(data)
                            : onAddEditErrorResponseJson(data)
                    )
                );
            }
        }

        return Promise.resolve(new FinalResponse(null, message));
    }

    public static async createResource<R, P>(
        resource: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(
            this.POST_RESOURSE,
            resource,
            {},
            {
                transformRequest: [
                    (payload: P, headers: SimpleObject<string>) => {
                        headers["Content-Type"] = "multipart/form-data";
                        return payload;
                    },
                ],
            }
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
