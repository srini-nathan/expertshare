import { AxiosError } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";
import { FinalResponse, ServerError } from "../../AppModule/models";

const {
    api_containers_delete_item: API_DELETE_ITEM,
    api_containers_get_item: API_GET_ITEM,
    api_containers_get_collection: API_GET_COLLECTION,
    api_containers_put_item: API_PUT_ITEM,
    api_containers_patch_item: API_PATCH_ITEM,
    api_containers_post_collection: API_POST_COLLECTION,
    api_containers_clone_collection: API_CLONE_COLLECTION,
} = ROUTES;

export abstract class ContainerApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

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
}
