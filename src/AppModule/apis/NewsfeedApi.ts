import { AxiosError } from "axios";

import { FinalResponse, ServerError, SimpleObject } from "../models";

import { ROUTES } from "../../config";

import { EntityAPI } from "./EntityAPI";

const { api_newsfeeds_post_collection: API_NEWSFEED_COLLECTION } = ROUTES;

export abstract class NewsfeedApi extends EntityAPI {
    protected static POST_NEWSFEED = API_NEWSFEED_COLLECTION;

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
}
