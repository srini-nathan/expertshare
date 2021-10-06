import { AxiosError, Canceler } from "axios";
import { EntityAPI } from "./EntityAPI";
import { ROUTES } from "../../config";
import { FinalResponse, ListResponse, ServerError } from "../models";
import { onFindAllResponseHydra, onFindAllResponseJson } from "./transformer";

const {
    api_meeting_bookings_delete_item: API_DELETE_ITEM,
    api_meeting_bookings_get_item: API_GET_ITEM,
    api_meeting_bookings_get_collection: API_GET_COLLECTION,
    api_meeting_bookings_put_item: API_PUT_ITEM,
    api_meeting_bookings_patch_item: API_PATCH_ITEM,
    api_meeting_bookings_post_collection: API_POST_COLLECTION,
    api_meeting_bookings_get_my_collection: API_GET_MY_COLLECTION,
} = ROUTES;

export abstract class MeetingBookingApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async getMyBookings<E>(
        page = 1,
        extraParams = {},
        cancelToken?: (c: Canceler) => void
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        const source = this.createCancelTokenSource();

        if (cancelToken) {
            cancelToken(source.cancel);
        }

        return this.makeGet<E>(
            API_GET_MY_COLLECTION,
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
