import { AxiosError, AxiosRequestConfig } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { FinalResponse, ServerError } from "../../AppModule/models";
import { route, ROUTES } from "../../config";

const {
    api_languages_delete_item: API_DELETE_ITEM,
    api_languages_get_item: API_GET_ITEM,
    api_languages_get_collection: API_GET_COLLECTION,
    api_languages_put_item: API_PUT_ITEM,
    api_languages_patch_item: API_PATCH_ITEM,
    api_languages_post_collection: API_POST_COLLECTION,
    api_language_set_default_collection: API_SET_DEFAULT,
} = ROUTES;

export abstract class LanguageApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async setDefaultLanguage<R, P = null>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig();
        return this.makePatch<R, P>(
            route(API_SET_DEFAULT, { id }),
            JSON.stringify({}),
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
