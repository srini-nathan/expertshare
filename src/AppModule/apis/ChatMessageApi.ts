import { AxiosError } from "axios";
import { FinalResponse, ServerError } from "../models";
import { EntityAPI } from "./EntityAPI";
import { ROUTES } from "../../config";

const {
    api_chat_messages_delete_item: API_DELETE_ITEM,
    api_chat_messages_get_item: API_GET_ITEM,
    api_chat_messages_get_collection: API_GET_COLLECTION,
    api_chat_messages_put_item: API_PUT_ITEM,
    api_chat_messages_patch_item: API_PATCH_ITEM,
    api_chat_messages_post_collection: API_POST_COLLECTION,
    api_chat_messages_export_collection: API_EXPORT,
} = ROUTES;

export abstract class ChatMessageApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async export(): Promise<any> {
        return this.makeGet<any>(API_EXPORT)
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
