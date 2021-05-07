import { EntityAPI } from "../../AppModule/apis/EntityAPI";

export abstract class ResetPasswordApi extends EntityAPI {
    protected static PATH = "/reset-password";
}
