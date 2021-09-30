import { AxiosError, AxiosRequestConfig } from "axios";
import { EntityAPI } from "./EntityAPI";
import { route, ROUTES } from "../../config";
import { FinalResponse, ServerError } from "../models";

const {
    api_meetings_delete_item: API_DELETE_ITEM,
    api_meetings_get_item: API_GET_ITEM,
    api_meetings_get_collection: API_GET_COLLECTION,
    api_meetings_put_item: API_PUT_ITEM,
    api_meetings_patch_item: API_PATCH_ITEM,
    api_meetings_post_collection: API_POST_COLLECTION,
    api_meetings_set_active_item: API_PATCH_SET_ACTIVE,
} = ROUTES;

export abstract class MeetingApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async setActive<R, P>(
        id: number,
        payload: P
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig();
        return this.makePatch<R, P>(
            route(API_PATCH_SET_ACTIVE, { id }),
            JSON.stringify(payload),
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
