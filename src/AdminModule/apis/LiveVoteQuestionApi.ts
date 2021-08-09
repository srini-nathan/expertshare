import { AxiosError, AxiosRequestConfig, Canceler } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { route, ROUTES } from "../../config";
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
    api_vote_questions_delete_item: API_DELETE_ITEM,
    api_vote_questions_get_item: API_GET_ITEM,
    api_vote_questions_get_collection: API_GET_COLLECTION,
    api_vote_questions_put_item: API_PUT_ITEM,
    api_vote_questions_patch_item: API_PATCH_ITEM,
    api_vote_questions_post_collection: API_POST_COLLECTION,
    api_vote_questions_select_collection: API_SELECT_PATCH_ITEM,
    api_vote_questions_result_publish_collection: API_RESULT_PUBLISH_COLLECTION,
    api_vote_questions_get_active_collection: API_GET_ACTIVE_COLLECTION,
} = ROUTES;

export abstract class LiveVoteQuestionApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async makeSelection<R, P>(
        id: number,
        entity: P
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig<P>();

        return this.makePatch<R, P>(
            route(API_SELECT_PATCH_ITEM, { id }),
            JSON.stringify(entity),
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async publishResult<R, P>(
        entity: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(API_RESULT_PUBLISH_COLLECTION, entity)
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async getActiveQuestions<E>(
        page = 1,
        extraParams = {},
        cancelToken?: (c: Canceler) => void
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        const source = this.createCancelTokenSource();

        if (cancelToken) {
            cancelToken(source.cancel);
        }

        return this.makeGet<E>(
            API_GET_ACTIVE_COLLECTION,
            {
                ...extraParams,
                page,
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
