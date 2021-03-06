import { AxiosError, Canceler } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { route, ROUTES } from "../../config";
import {
    EntityNotFoundErrorResponse,
    FinalResponse,
    ServerError,
    ListResponse,
} from "../../AppModule/models";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis/transformer";

const {
    api_containers_delete_item: API_DELETE_ITEM,
    api_containers_get_item: API_GET_ITEM,
    api_containers_get_collection: API_GET_COLLECTION,
    api_containers_put_item: API_PUT_ITEM,
    api_containers_patch_item: API_PATCH_ITEM,
    api_containers_post_collection: API_POST_COLLECTION,
    api_containers_clone_collection: API_CLONE_COLLECTION,
    api_containers_get_overview_collection: API_GET_OVERVIEW_COLLECTION,
    api_containers_my_container_collection: API_GET_MY_CONTAINER_COLLECTION,
    api_containers_get_secure_item: GET_SECURE_ITEM,
    api_containers_gen_style_request_collection: API_POST_REQUEST_STYLE_COLLECTION,
    api_containers_gen_translation_request_collection: API_POST_REQUEST_TRANSLATION_COLLECTION,
} = ROUTES;

export abstract class ContainerApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async getSecureContainer<R>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        const path = route(GET_SECURE_ITEM, { id });
        return this.makeGet<R>(path)
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error) => {
                const { response } = error as AxiosError;
                if (response) {
                    const { status } = response;
                    if (status === 404) {
                        return Promise.resolve(
                            new FinalResponse(
                                null,
                                new EntityNotFoundErrorResponse()
                            )
                        );
                    }
                }
                return Promise.reject(error);
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

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

    public static async overview<R>(
        page = 1,
        extraParams = {},
        cancelToken?: (c: Canceler) => void
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        const source = this.createCancelTokenSource();

        if (cancelToken) {
            cancelToken(source.cancel);
        }

        return this.makeGet<R>(
            API_GET_OVERVIEW_COLLECTION,
            {
                ...extraParams,
                page,
            },
            {
                cancelToken: source.token,
            }
        )
            .then(({ data }) => {
                // @TODO: create method to handle it, to reduce duplicate code
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<R>(data)
                    : onFindAllResponseJson<R>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<R>>(list)
                );
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async myContainer<R>(): Promise<FinalResponse<R | null>> {
        return this.makeGet<R>(API_GET_MY_CONTAINER_COLLECTION)
            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<R>(data)
                    : onFindAllResponseJson<R>(data);
                const single = list.items[0];
                return Promise.resolve(new FinalResponse<R>(single));
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async generateStyleRequest<R, P = null>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(API_POST_REQUEST_STYLE_COLLECTION, {
            cloneId: id,
        })
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async generateTranslationRequest<R, P = null>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(API_POST_REQUEST_TRANSLATION_COLLECTION, {
            cloneId: id,
        })
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
