import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class UserGroupApi extends EntityAPI {
    protected static PATH = "/api/user_groups";
}
