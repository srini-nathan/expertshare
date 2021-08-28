import { ROUTES } from "../../config";
import { EntityAPI } from "./EntityAPI";
import { FinalResponse, ListResponse } from "../models";

const {
    api_exhibitor_comments_get_collection: API_GET_EXHIBITOR_COMMENTS,
    api_exhibitor_comments_post_collection: API_POST_EXHIBITOR_COMMENTS,
    api_exhibitor_comments_delete_item: API_DELETE_EXHIBITOR_ITEM,
    api_exhibitor_comments_put_item: API_PUT_EXHIBITOR_ITEM,
    api_exhibitor_comments_patch_item: API_PATCH_EXHIBITOR_ITEM,
} = ROUTES;

export abstract class ExhibitorCommentsAPI extends EntityAPI {
    protected static GET_COLLECTION = API_GET_EXHIBITOR_COMMENTS;

    protected static POST_COLLECTION = API_POST_EXHIBITOR_COMMENTS;

    protected static DELETE_ITEM = API_DELETE_EXHIBITOR_ITEM;

    protected static PUT_ITEM = API_PUT_EXHIBITOR_ITEM;

    protected static PATCH_ITEM = API_PATCH_EXHIBITOR_ITEM;

    public static async getMessages<E>(
        exhibitor: number,
        container: number,
        page = 1
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        return this.find<E>(page, {
            "exhibitor.id": exhibitor,
            "container.id": container,
            "order[id]": "desc",
        });
    }
}
