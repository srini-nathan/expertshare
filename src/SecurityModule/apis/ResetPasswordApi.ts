import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";

export abstract class ResetPasswordApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_reset_password_collection;
}
