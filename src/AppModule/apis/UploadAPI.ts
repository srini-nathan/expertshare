import { AxiosError } from "axios";
import { FinalResponse, ServerError, SimpleObject } from "../models";
import { ROUTES } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    api_uploads_delete_item: API_DELETE_ITEM,
    api_uploads_get_item: API_GET_ITEM,
    api_uploads_post_collection: API_POST_COLLECTION,
} = ROUTES;

export abstract class UploadAPI extends EntityAPI {
    protected static GET_ITEM = API_GET_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async createResource<R, P>(
        resource: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(
            API_POST_COLLECTION,
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
