import { AxiosResponse } from "axios";
import { EntityAPI } from "./EntityAPI";
import { User } from "../models";

export abstract class UserApi extends EntityAPI {
    protected static PATH = "/api/users";

    public static async me(): Promise<User> {
        const res: AxiosResponse<User> = await this.makeGet<User>(`/api/me`);
        return res.data;
    }
}
