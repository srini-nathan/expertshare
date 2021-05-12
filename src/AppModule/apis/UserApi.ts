import { AxiosResponse } from "axios";
import { EntityAPI } from "./EntityAPI";
import { User } from "../models";
import { ROUTES } from "../../config";

export abstract class UserApi extends EntityAPI {
    protected static GET_ALL_PATH = ROUTES.api_users_get_collection;

    protected static GET_BY_ID_PATH = ROUTES.api_users_get_item;

    protected static DELETE_ITEM_PATH = ROUTES.api_users_delete_item;

    protected static PUT_ITEM_PATH = ROUTES.api_users_put_item;

    public static async me(): Promise<User> {
        const res: AxiosResponse<User> = await this.makeGet<User>(`/api/me`);
        return res.data;
    }
}
