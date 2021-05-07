import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ResetPasswordRequestApi extends EntityAPI {
    protected static PATH = "/reset-password-request";
}
