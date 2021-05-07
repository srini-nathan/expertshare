import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ResetPasswordApi extends EntityAPI {
    protected static PATH = "/api/clients";

    static CLIENT_LIST_PAGE_PATH = "/admin/clients/";

    static CLIENT_NEW_PAGE_PATH = "/admin/clients/new";
}
