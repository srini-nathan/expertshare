import { AxiosError, AxiosRequestConfig } from "axios";
import { FinalResponse, ServerError, SimpleObject } from "../models";
import { ROUTES, route } from "../../config";
import { EntityAPI } from "./EntityAPI";

const {
    api_exhibitor_comments_get_collection: API_GET_EXHIBITOR_COMMENTS,
    api_exhibitor_comments_post_collection: API_POST_EXHIBITOR_COMMENTS,
    api_exhibitor_comments_delete_item: API_DELETE_EXHIBITOR_ITEM,
    api_exhibitor_comments_put_item: API_PUT_EXHIBITOR_ITEM,
    api_exhibitor_comments_patch_item: API_PATCH_EXHIBITOR_ITEM,
} = ROUTES;

export abstract class ExhibitorCommentsAPI extends EntityAPI {
    protected static GET_EXHIBITOR_COMMENT = API_GET_EXHIBITOR_COMMENTS;

    protected static POST_EXHIBITOR_COMMENT = API_POST_EXHIBITOR_COMMENTS;

    protected static DELETE_EXHIBITOR_COMMENT = API_DELETE_EXHIBITOR_ITEM;

    protected static PUT_EXHIBITOR_COMMENT = API_PUT_EXHIBITOR_ITEM;

    protected static PATCH_EXHIBITOR_COMMENT = API_PATCH_EXHIBITOR_ITEM;

    public static async postComment<R, P>(
        comment: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(
            API_POST_EXHIBITOR_COMMENTS,
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
        exhibitor: number,
        container: number,
        page = 1
    ): Promise<any> {
        return this.makeGet<any>(API_GET_EXHIBITOR_COMMENTS, {
            page,
            "exhibitor.id": exhibitor,
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
            API_POST_EXHIBITOR_COMMENTS,
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
            route(API_PATCH_EXHIBITOR_ITEM, { id }),
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
        return this.makeDelete(route(API_DELETE_EXHIBITOR_ITEM, { id }))
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
