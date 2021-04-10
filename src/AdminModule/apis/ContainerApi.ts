import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ContainerApi extends EntityAPI {
    protected static PATH = "/api/containers";

    static CLIENT_LIST_PAGE_PATH = "/admin/container/";

    static CLIENT_NEW_PAGE_PATH = "/admin/container/new";
}
