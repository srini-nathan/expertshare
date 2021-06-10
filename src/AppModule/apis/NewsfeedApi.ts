import { AxiosError } from "axios";

import { FinalResponse, ServerError, SimpleObject } from "../models";

import { ROUTES, route } from "../../config";

import { EntityAPI } from "./EntityAPI";

const {
    api_newsfeeds_post_collection: API_NEWSFEED_COLLECTION,
    api_newsfeeds_get_collection: API_NEWSFEED_GET_COLLECTION,
    api_newsfeeds_delete_item: API_NEWSFEED_DELETE_ITEM,
    api_newsfeeds_patch_item: API_NEWSFEED_PATCH_ITEM,
} = ROUTES;

export abstract class NewsfeedApi extends EntityAPI {
    protected static POST_NEWSFEED = API_NEWSFEED_COLLECTION;

    protected static GET_NEWSFEED = API_NEWSFEED_GET_COLLECTION;

    protected static DELETE_NEWSFEED = API_NEWSFEED_DELETE_ITEM;

    protected static PATCH_NEWSFEED = API_NEWSFEED_PATCH_ITEM;

    public static async postNewsfeed<R, P>(
        resource: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(
            API_NEWSFEED_COLLECTION,
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

    public static async getNewsfeed(container: number): Promise<any> {
        return this.makeGet<any>(API_NEWSFEED_GET_COLLECTION, {
            "container.id": container,
        })

            .then(({ data }) => {
                return data;
            })

            .catch((error: AxiosError | ServerError) => {
                const { message } = error;

                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async deleteNewsfeedById(id: number): Promise<any> {
        return this.makeDelete(route(API_NEWSFEED_DELETE_ITEM, { id }))
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
