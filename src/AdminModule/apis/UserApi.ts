import { AxiosError, AxiosRequestConfig } from "axios";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import {
    FinalResponse,
    ListResponse,
    ServerError,
} from "../../AppModule/models";
import { route, ROUTES } from "../../config";

const {
    api_users_delete_item: API_DELETE_ITEM,
    api_users_get_item: API_GET_ITEM,
    api_users_get_collection: API_GET_COLLECTION,
    api_users_patch_item: API_PATCH_ITEM,
    api_users_put_item: API_PUT_ITEM,
    api_users_post_collection: API_POST_COLLECTION,
    api_users_get_attendee_view_item: API_GET_ATTENDEE_COLLECTION,
    api_users_get_attendee_list_collection: API_GET_ATTENDEE_LIST_COLLECTION,
    api_users_change_password_item: API_CHANGE_PASSWORD_COLLECTION,
    api_users_change_profile_item: API_UPDATE_PROFILE_COLLECTION,
    api_users_import_collection: API_IMPORT,
    api_users_invite_collection: API_INVITE,
    api_users_export_collection: API_EXPORT,
    api_users_get_limited_collection: GET_LIMITED_USERS,
    api_users_email_exist_collection: EMAIL_EXIST,
} = ROUTES;

export abstract class UserApi extends EntityAPI {
    protected static GET_COLLECTION = API_GET_COLLECTION;

    protected static POST_COLLECTION = API_POST_COLLECTION;

    protected static GET_ITEM = API_GET_ITEM;

    protected static PATCH_ITEM = API_PATCH_ITEM;

    protected static PUT_ITEM = API_PUT_ITEM;

    protected static DELETE_ITEM = API_DELETE_ITEM;

    public static async getAttendeeView<R>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        return this.makeGet<R>(route(API_GET_ATTENDEE_COLLECTION, { id }))
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async getAttendeeList<R>(
        page = 1,
        extraParams = {}
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(API_GET_ATTENDEE_LIST_COLLECTION, {
            ...extraParams,
            page,
        })

            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<R>(data)
                    : onFindAllResponseJson<R>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<R>>(list)
                );
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async getLimited<R>(
        page = 1,
        extraParams = {}
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(GET_LIMITED_USERS, {
            ...extraParams,
            page,
        })
            .then(({ data }) => {
                const list = this.acceptHydra
                    ? onFindAllResponseHydra<R>(data)
                    : onFindAllResponseJson<R>(data);
                return Promise.resolve(
                    new FinalResponse<ListResponse<R>>(list)
                );
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async changePassword<R, P>(
        id: number,
        entity: P
    ): Promise<FinalResponse<R | null>> {
        const config: AxiosRequestConfig = this.getPatchRequestConfig<P>();

        return this.makePatch<R, P>(
            route(API_CHANGE_PASSWORD_COLLECTION, { id }),
            JSON.stringify(entity),
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async emailExist(entity: any): Promise<any> {
        return this.makePost<any, any>(EMAIL_EXIST, entity)
            .then(({ data }) => {
                return Promise.resolve(new FinalResponse(data, null));
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async updateProfile<R, P>(
        id: number,
        entity: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePut<R, P>(
            route(API_UPDATE_PROFILE_COLLECTION, { id }),
            entity
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async exportUsers(): Promise<any> {
        return this.makeGet<any>(API_EXPORT)
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async inviteUsers(entity: any): Promise<any> {
        return this.makePost<any, any>(API_INVITE, entity)
            .then(({ data }) => {
                return Promise.resolve(new FinalResponse(data, null));
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async importUsers(entity: any): Promise<any> {
        const config: AxiosRequestConfig = this.getPostMultiPartRequestConfig();

        return this.makePost<any, any>(API_IMPORT, entity, {}, config)
            .then(({ data }) => {
                return Promise.resolve(new FinalResponse(data, null));
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
