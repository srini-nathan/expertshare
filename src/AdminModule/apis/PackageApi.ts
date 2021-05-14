import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class PackageApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_packages_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_packages_get_item;

    protected static DELETE_ITEM_PATH = ROUTES.api_packages_delete_item;

    protected static PUT_ITEM_PATH = ROUTES.api_packages_put_item;
}
