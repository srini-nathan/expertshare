import { AxiosError } from "axios";
import { FinalResponse, ServerError } from "../models";
import { ROUTES } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    api_session_comments_get_collection: API_GET_SESSIONS_COMMENTS,
    api_session_comments_post_collection: API_POST_SESSION_COMMENTS,
    api_session_comments_delete_item: API_DELETE_SESSION_ITEM,
    api_session_comments_put_item: API_PUT_SESSION_ITEM,
    api_session_comments_patch_item: API_PATCH_SESSION_ITEM,
} = ROUTES;

export abstract class SessionCommentsAPI extends EntityAPI {
    protected static GET_SESSION_COMMENT = API_GET_SESSIONS_COMMENTS;

    protected static POST_COLLECTION = API_POST_SESSION_COMMENTS;

    protected static DELETE_ITEM = API_DELETE_SESSION_ITEM;

    protected static PUT_ITEM = API_PUT_SESSION_ITEM;

    protected static PATCH_ITEM = API_PATCH_SESSION_ITEM;

    public static async getMessages(
        session: number,
        container: number,
        page = 1
    ): Promise<any> {
        return this.makeGet<any>(API_GET_SESSIONS_COMMENTS, {
            page,
            "session.id": session,
            "container.id": container,
            "order[id]": "desc",
        })
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
