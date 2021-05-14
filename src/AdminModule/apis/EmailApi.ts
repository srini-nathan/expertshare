import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class EmailApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_email_templates_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_email_templates_get_item;

    protected static DELETE_ITEM_PATH = ROUTES.api_email_templates_delete_item;

    protected static PUT_ITEM_PATH = ROUTES.api_email_templates_put_item;
}
