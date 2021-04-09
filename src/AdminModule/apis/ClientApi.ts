import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ClientApi extends EntityAPI {
    protected static PATH = "/api/clients";

    static CLIENT_LIST_PAGE_PATH = "/admin/client/";

    static CLIENT_NEW_PAGE_PATH = "/admin/client/new";
}
