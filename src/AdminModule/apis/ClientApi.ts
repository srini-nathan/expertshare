import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class ClientApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_clients_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_clients_get_item;

    protected static DELETE_ITEM_PATH = ROUTES.api_clients_delete_item;

    protected static PUT_ITEM_PATH = ROUTES.api_clients_put_item;

    static CLIENT_LIST_PAGE_PATH = "/admin/clients/";

    static CLIENT_NEW_PAGE_PATH = "/admin/clients/new";
}
