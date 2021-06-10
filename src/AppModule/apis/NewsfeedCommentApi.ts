import { AxiosError } from "axios";

import { FinalResponse, ServerError, SimpleObject } from "../models";

import { ROUTES } from "../../config";

import { EntityAPI } from "./EntityAPI";

const {
    api_newsfeed_comments_get_collection: API_NEWSFEED_GET_COMMENTS,
    api_newsfeed_comments_post_collection: API_NEWSFEED_POST_COLLECTION,
} = ROUTES;

export abstract class NewsfeedCommentApi extends EntityAPI {
    protected static GET_NEWSFEED_COMMENTS = API_NEWSFEED_GET_COMMENTS;

    protected static POST_NEWSFEED_COMMENTS = API_NEWSFEED_POST_COLLECTION;

    public static async postNewsfeedComments<R, P>(
        resource: P
    ): Promise<FinalResponse<R | null>> {
        // eslint-disable-next-line no-console
        console.log(resource);
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

    public static async getNewsfeedComments(newsfeedId: number): Promise<any> {
        return this.makeGet<any>(API_NEWSFEED_GET_COMMENTS, {
            "newsfeed.id": newsfeedId,
        })

            .then(({ data }) => {
                return data;
            })

            .catch((error: AxiosError | ServerError) => {
                const { message } = error;

                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
