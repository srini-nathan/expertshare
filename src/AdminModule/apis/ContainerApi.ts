import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ContainerApi extends EntityAPI {
    protected static PATH = "/api/containers";

    static CONTAINER_LIST_PAGE_PATH = "/admin/container/";

    static CONTAINER_NEW_PAGE_PATH = "/admin/container/new";

    static CONFIGURATION_TYPE = "configuration-type";
}
