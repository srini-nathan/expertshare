import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ClientApi extends EntityAPI {
    protected static PATH = "/api/clients";
}
