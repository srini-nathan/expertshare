import { AxiosError } from "axios";
import { FinalResponse, ServerError, SimpleObject } from "../models";
import { ROUTES } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    api_session_comments_get_collection: API_GET_SESSIONS_COMMENTS,
    api_session_comments_post_collection: API_POST_SESSION_COMMENTS,
} = ROUTES;

export abstract class SessionCommentsAPI extends EntityAPI {
    protected static GET_SESSION_COMMENT = API_GET_SESSIONS_COMMENTS;

    protected static POST_SESSION_COMMENT = API_POST_SESSION_COMMENTS;

    public static async postComment<R, P>(
        comment: P
    ): Promise<FinalResponse<R | null>> {
        // eslint-disable-next-line no-console
        console.log(comment);
        return this.makePost<R, P>(
            API_POST_SESSION_COMMENTS,
            comment,
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

    public static async getMessages(): Promise<any> {
        return this.makeGet<any>(API_GET_SESSIONS_COMMENTS)
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
