import { ROUTES } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    api_session_questions_get_collection: API_GET,
    api_session_questions_post_collection: API_POST,
    api_session_questions_delete_item: API_DELETE,
    api_session_questions_put_item: API_PUT,
    api_session_questions_patch_item: API_PATCH,
} = ROUTES;

export abstract class SessionQuestionApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET;

    protected static POST_COLLECTION = API_POST;

    protected static DELETE_ITEM = API_DELETE;

    protected static PUT_ITEM = API_PUT;

    protected static PATCH_ITEM = API_PATCH;
}
