import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class UserGroupApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_user_groups_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_user_groups_get_item;
}
