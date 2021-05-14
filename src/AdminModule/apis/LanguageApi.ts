import { AxiosError, AxiosRequestConfig } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { FinalResponse, ServerError } from "../../AppModule/models";
import { ROUTES } from "../../config";

export abstract class LanguageApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_languages_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_languages_get_item;

    protected static DELETE_ITEM_PATH = ROUTES.api_languages_delete_item;

    protected static PUT_ITEM_PATH = ROUTES.api_languages_put_item;

    public static async setDefaultLanguage<R, P = null>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig();
        // @TODO: remove hard-coded url
        return this.makePatch<R, P>(
            `${this.GET_ALL_PATH}/${id}/set-default`,
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
