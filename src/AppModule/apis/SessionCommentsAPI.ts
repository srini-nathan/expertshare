import { AxiosError, AxiosRequestConfig } from "axios";
import { FinalResponse, ServerError, SimpleObject } from "../models";
import { ROUTES, route } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    api_session_comments_get_collection: API_GET_SESSIONS_COMMENTS,
    api_session_comments_post_collection: API_POST_SESSION_COMMENTS,
    api_session_comments_delete_item: API_DELETE_SESSION_ITEM,
    api_session_comments_put_item: API_PUT_SESSION_ITEM,
    api_session_comments_patch_item: API_PATCH_SESSION_ITEM,
} = ROUTES;

export abstract class SessionCommentsAPI extends EntityAPI {
    protected static GET_SESSION_COMMENT = API_GET_SESSIONS_COMMENTS;

    protected static POST_SESSION_COMMENT = API_POST_SESSION_COMMENTS;

    protected static DELETE_SESSION_COMMENT = API_DELETE_SESSION_ITEM;

    protected static PUT_SESSION_COMMENT = API_PUT_SESSION_ITEM;

    protected static PATCH_SESSION_COMMENT = API_PATCH_SESSION_ITEM;

    public static async postComment<R, P>(
        comment: P
    ): Promise<FinalResponse<R | null>> {
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

    public static async getMessages(
        session: number,
        container: number,
        page = 1
    ): Promise<any> {
        return this.makeGet<any>(API_GET_SESSIONS_COMMENTS, {
            page,
            "session.id": session,
            "container.id": container,
            "order[id]": "desc",
        })
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async postAnswer<R, P>(
        comment: P
    ): Promise<FinalResponse<R | null>> {
        // eslint-disable-next-line no-console
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

    public static async update<R, P>(
        id: number,
        entity: P
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig<P>();

        return this.makePatch<R, P>(
            route(API_PATCH_SESSION_ITEM, { id }),
            entity,
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async deleteById(id: number): Promise<any> {
        return this.makeDelete(route(API_DELETE_SESSION_ITEM, { id }))
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
