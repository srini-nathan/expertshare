import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class UserFieldsApi extends EntityAPI {
    protected static PATH = "/api/user_fields";
}
