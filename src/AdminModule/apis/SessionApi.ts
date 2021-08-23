import { AxiosError } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import {
    FinalResponse,
    ServerError,
    ListResponse,
} from "../../AppModule/models";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis/transformer";
import { ROUTES } from "../../config";

const {
    api_sessions_delete_item: API_DELETE_ITEM,
    api_sessions_get_item: API_GET_ITEM,
    api_sessions_put_item: API_PUT_ITEM,
    api_sessions_patch_item: API_PATCH_ITEM,
    api_sessions_post_collection: API_POST_COLLECTION,
    api_sessions_get_collection: API_GET_COLLECTION,
    api_sessions_get_agenda_collection: API_GET_AGENDA,
    api_sessions_change_card_size_collection: API_CHANGE_CARD_SIZE,
    api_sessions_get_item_collection: GET_ITEM,
} = ROUTES;

export abstract class SessionApi extends EntityAPI {
    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async getAgenda<R>(
        extraparams = {}
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(API_GET_AGENDA, { ...extraparams })
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

    public static async getSession<R>(
        extraparams = {}
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(GET_ITEM, { ...extraparams })
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

    public static async changeCardSize<R, P>(
        formData: any
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(API_CHANGE_CARD_SIZE, formData)
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
