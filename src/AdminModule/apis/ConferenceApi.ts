import { AxiosError } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";
import {
    ListResponse,
    FinalResponse,
    ServerError,
} from "../../AppModule/models";

import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis/transformer";

const {
    api_conferences_delete_item: API_DELETE_ITEM,
    api_conferences_get_item: API_GET_ITEM,
    api_conferences_get_collection: API_GET_COLLECTION,
    api_conferences_put_item: API_PUT_ITEM,
    api_conferences_patch_item: API_PATCH_ITEM,
    api_conferences_post_collection: API_POST_COLLECTION,
    api_conferences_clone_collection: API_CLONE_COLLECTION,
    api_conferences_get_all_collection: API_GET_ALL_COLLECTION,
} = ROUTES;

export abstract class ConferenceApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    protected static API_GET_ALL_COLLECTION = API_GET_ALL_COLLECTION;

    public static async clone<R, P = null>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(API_CLONE_COLLECTION, {
            cloneId: id,
        })
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async getCollection<R>(
        extraParams = {}
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(API_GET_ALL_COLLECTION, {
            ...extraParams,
        })
            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<R>(data)
                    : onFindAllResponseJson<R>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<R>>(list)
                );
            })
            .catch((error) => this.handleUnknownError(error));
    }
}
