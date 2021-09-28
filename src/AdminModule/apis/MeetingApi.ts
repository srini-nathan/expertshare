import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

const {
    api_meetings_delete_item: API_DELETE_ITEM,
    api_meetings_get_item: API_GET_ITEM,
    api_meetings_get_collection: API_GET_COLLECTION,
    api_meetings_put_item: API_PUT_ITEM,
    api_meetings_patch_item: API_PATCH_ITEM,
    api_meetings_post_collection: API_POST_COLLECTION,
} = ROUTES;

export abstract class MeetingApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;
}
