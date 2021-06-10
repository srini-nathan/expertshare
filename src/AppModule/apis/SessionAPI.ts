import { AxiosError } from "axios";
import { FinalResponse, ServerError, SimpleObject } from "../models";
import { ROUTES } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    // api_sessions_get_agenda_collection: API_GET_SESSIONS_RESOURCES,
    api_sessions_post_collection: API_POST_SESSION,
} = ROUTES;

export abstract class SessionAPI extends EntityAPI {
    // protected static GET_SESSIONS = API_GET_SESSIONS_RESOURCES;

    protected static POST_SESSION = API_POST_SESSION;

    public static async postSession<R, P>(
        resource: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(
            API_POST_SESSION,
            resource,
            {},
            {
                transformRequest: [
                    (payload: P, headers: SimpleObject<string>) => {
                        headers["Content-Type"] = "application/json";
                        return payload;
                    },
                ],
            }
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
