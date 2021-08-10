import { AxiosError, Canceler } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ROUTES } from "../../config";
import {
    FinalResponse,
    ListResponse,
    ServerError,
} from "../../AppModule/models";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis";

const {
    api_vote_results_delete_item: API_DELETE_ITEM,
    api_vote_results_get_item: API_GET_ITEM,
    api_vote_results_get_collection: API_GET_COLLECTION,
    api_vote_results_put_item: API_PUT_ITEM,
    api_vote_results_patch_item: API_PATCH_ITEM,
    api_vote_results_post_collection: API_POST_COLLECTION,
    api_vote_results_get_my_result_collection: API_GET_MY_RESULT,
    api_vote_results_overview_collection: API_GET_OVERVIEW,
} = ROUTES;

export abstract class LiveVoteResultApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async getMyResult<E>(
        questionId: number,
        extraParams = {},
        cancelToken?: (c: Canceler) => void
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        const source = this.createCancelTokenSource();

        if (cancelToken) {
            cancelToken(source.cancel);
        }

        return this.makeGet<E>(
            API_GET_MY_RESULT,
            {
                "voteQuestion.id": questionId,
                ...extraParams,
            },
            {
                cancelToken: source.token,
            }
        )
            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<E>(data)
                    : onFindAllResponseJson<E>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<E>>(list)
                );
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async getOverview<E>(
        questionId: number,
        extraParams = {},
        cancelToken?: (c: Canceler) => void
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        const source = this.createCancelTokenSource();

        if (cancelToken) {
            cancelToken(source.cancel);
        }

        return this.makeGet<E>(
            API_GET_OVERVIEW,
            {
                "voteQuestion.id": questionId,
                ...extraParams,
            },
            {
                cancelToken: source.token,
            }
        )
            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<E>(data)
                    : onFindAllResponseJson<E>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<E>>(list)
                );
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
