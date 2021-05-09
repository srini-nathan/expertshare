import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class EmailApi extends EntityAPI {
    protected static PATH = "/api/email_templates";
}
