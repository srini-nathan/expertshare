import { AxiosError } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";
import {
    FinalResponse,
    ServerError,
    ListResponse,
} from "../../AppModule/models";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis/transformer";

const {
    api_exhibitors_get_collection: API_GET_COLLECTION,
    api_exhibitors_post_collection: API_POST_COLLECTION,
    api_exhibitors_get_item: API_GET_ITEM,
    api_exhibitors_put_item: API_PUT_ITEM,
    api_exhibitors_patch_item: API_PATCH_ITEM,
    api_exhibitors_delete_item: API_DELETE_ITEM,
    api_exhibitors_get_all_collection: GET_ALL,
} = ROUTES;

export abstract class ExhibitorApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async getAllExhibitor<R>(
        extraParams = {}
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(GET_ALL, extraParams)
            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<R>(data)
                    : onFindAllResponseJson<R>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<R>>(list)
                );
            })
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
