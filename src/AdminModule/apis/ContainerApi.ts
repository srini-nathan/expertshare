import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class ContainerApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_containers_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_containers_get_item;

    protected static DELETE_ITEM_PATH = ROUTES.api_containers_delete_item;

    protected static PUT_ITEM_PATH = ROUTES.api_containers_put_item;

    static CONTAINER_LIST_PAGE_PATH = "/admin/container/";

    static CONTAINER_NEW_PAGE_PATH = "/admin/container/new";

    static CONFIGURATION_TYPE = "configuration-type";
}
