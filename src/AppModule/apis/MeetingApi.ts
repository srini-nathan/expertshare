import { AxiosError, AxiosRequestConfig } from "axios";
import { EntityAPI } from "./EntityAPI";
import { route, ROUTES } from "../../config";
import { FinalResponse, ListResponse, ServerError } from "../models";
import { onFindAllResponseHydra, onFindAllResponseJson } from "./transformer";

const {
    api_meetings_delete_item: API_DELETE_ITEM,
    api_meetings_get_item: API_GET_ITEM,
    api_meetings_get_collection: API_GET_COLLECTION,
    api_meetings_put_item: API_PUT_ITEM,
    api_meetings_patch_item: API_PATCH_ITEM,
    api_meetings_post_collection: API_POST_COLLECTION,
    api_meetings_set_active_item: API_PATCH_SET_ACTIVE,
    api_meeting_get_slots: API_GET_SLOTS,
    api_meetings_get_active_collection: API_GET_ACTIVES,
} = ROUTES;

export abstract class MeetingApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async setActive<R, P>(
        id: number,
        payload: P
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig();
        return this.makePatch<R, P>(
            route(API_PATCH_SET_ACTIVE, { id }),
            JSON.stringify(payload),
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async getSlots<R>(
        meetingId: number,
        date: string,
        duration: string
    ): Promise<FinalResponse<R | null>> {
        return this.makeGet<R>(API_GET_SLOTS, {
            meetingId,
            date,
            duration,
        })
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async getUserActiveMeetings<E>(
        userId: number,
        clientId: number
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        return this.makeGet<E>(API_GET_ACTIVES, {
            "user.id": userId,
            "client.id": clientId,
        })
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
