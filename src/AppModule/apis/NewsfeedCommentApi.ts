import { AxiosError } from "axios";

import { FinalResponse, ServerError, SimpleObject } from "../models";

import { ROUTES, route } from "../../config";

import { EntityAPI } from "./EntityAPI";

const {
    api_newsfeed_comments_get_collection: API_NEWSFEED_GET_COMMENTS,
    api_newsfeed_comments_post_collection: API_NEWSFEED_POST_COLLECTION,
    api_newsfeed_comments_delete_item: API_NEWSFEED_COMMENTS_DELETE_ITEM,
} = ROUTES;

export abstract class NewsfeedCommentApi extends EntityAPI {
    protected static GET_NEWSFEED_COMMENTS = API_NEWSFEED_GET_COMMENTS;

    protected static POST_NEWSFEED_COMMENTS = API_NEWSFEED_POST_COLLECTION;

    protected static DELETE_NEWSFEED_COMMENT = API_NEWSFEED_COMMENTS_DELETE_ITEM;

    public static async postNewsfeedComments<R, P>(
        resource: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(
            API_NEWSFEED_POST_COLLECTION,
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

    public static async getNewsfeedComments(
        newsfeedId: number,
        page: number
    ): Promise<any> {
        return this.makeGet<any>(API_NEWSFEED_GET_COMMENTS, {
            "newsfeed.id": newsfeedId,
            page,
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

    public static async deleteNewsfeedCommentById(id: number): Promise<any> {
        return this.makeDelete(route(API_NEWSFEED_COMMENTS_DELETE_ITEM, { id }))
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
