import { AxiosError, AxiosRequestConfig, AxiosResponse, Canceler } from "axios";
import { API } from "./API";
import { ACCEPTABLE_RESPONSE } from "../config/app-env";
import {
    AcceptableResponse,
    EntityNotFoundErrorResponse,
    FinalResponse,
    ListResponse,
    ServerError,
    SimpleObject,
} from "../models";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
    onUpdateRequestHydra,
} from "./transformer";
import { onAddEditErrorResponseHydra } from "./transformer/on-add-edit-error-response-hydra";
import { onAddEditErrorResponseJson } from "./transformer/on-add-edit-error-response-json";

export abstract class EntityAPI extends API {
    protected static acceptHydra = AcceptableResponse.isHydra(
        ACCEPTABLE_RESPONSE
    );

    protected static PATH = "/";

    /**
     * @deprecated
     */
    public static async findById<R>(id: number): Promise<R> {
        const res: AxiosResponse<R> = await this.makeGet<R>(
            `${this.PATH}/${id}`
        );
        return res.data;
    }

    public static async getById<R>(
        id: number
    ): Promise<FinalResponse<R | null>> {
        return this.makeGet<R>(`${this.PATH}/${id}`)
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error) => this.handleServerError(error))
            .catch((error) => {
                const { response } = error as AxiosError;
                if (response) {
                    const { status } = response;
                    if (status === 404) {
                        return Promise.resolve(
                            new FinalResponse(
                                null,
                                new EntityNotFoundErrorResponse()
                            )
                        );
                    }
                }
                return Promise.reject(error);
            })
            .catch((error) => this.handleUnknownError(error));
    }

    /**
     * @deprecated
     */
    public static async findAll<R>(
        page = 1,
        extraParams = {}
    ): Promise<ListResponse<R>> {
        let config: AxiosRequestConfig;

        if (AcceptableResponse.isHydra(ACCEPTABLE_RESPONSE)) {
            config = {
                transformResponse: [(data) => onFindAllResponseHydra<R>(data)],
            };
        } else {
            config = {
                transformResponse: [(data) => onFindAllResponseJson<R>(data)],
            };
        }

        const res: AxiosResponse<ListResponse<R>> = await this.makeGet<
            ListResponse<R>
        >(
            this.PATH,
            {
                ...extraParams,
                page,
            },
            config
        );
        return res.data;
    }

    public static async find<E>(
        page = 1,
        extraParams = {},
        cancelToken?: (c: Canceler) => void
    ): Promise<FinalResponse<ListResponse<E> | null>> {
        const source = this.createCancelTokenSource();

        if (cancelToken) {
            cancelToken(source.cancel);
        }

        return this.makeGet<E>(
            this.PATH,
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

    public static async delete(id: number): Promise<FinalResponse<null>> {
        return this.makeDelete(`${this.PATH}/${id}`)
            .then(() => Promise.resolve(new FinalResponse(null)))
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                if (error instanceof ServerError) {
                    return Promise.resolve(new FinalResponse(null, message));
                }

                const { response } = error as AxiosError;
                if (response) {
                    const { status } = response;
                    if (status === 404) {
                        return Promise.resolve(
                            new FinalResponse(
                                null,
                                new EntityNotFoundErrorResponse()
                            )
                        );
                    }
                }

                return Promise.resolve(new FinalResponse(null, message));
            });
    }

    public static async create<R, P>(
        entity: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePost<R, P>(this.PATH, entity)
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
            `${this.PATH}/${id}`,
            JSON.stringify(entity),
            {},
            config
        )
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    public static async createOrUpdate<E>(
        id: number | null,
        entity: E
    ): Promise<FinalResponse<E | null>> {
        if (id !== null) {
            return this.update<E, E>(id, entity);
        }
        return this.create<E, E>(entity);
    }

    public static async replace<R, P>(
        id: number,
        entity: P
    ): Promise<FinalResponse<R | null>> {
        return this.makePut<R, P>(`${this.PATH}/${id}`, entity)
            .then(({ data }) => Promise.resolve(new FinalResponse<R>(data)))
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }

    private static handleServerError(
        error: AxiosError | ServerError
    ): Promise<FinalResponse<null>> {
        const { message } = error;
        if (error instanceof ServerError) {
            return Promise.resolve(new FinalResponse(null, message));
        }
        return Promise.reject(error);
    }

    private static handleUnknownError(
        error: AxiosError | ServerError
    ): Promise<FinalResponse<null>> {
        const { message } = error;
        return Promise.resolve(new FinalResponse(null, message));
    }

    protected static handleErrorDuringCreatingOrUpdating(
        error: AxiosError | ServerError
    ): Promise<FinalResponse<null>> {
        const { message } = error;

        if (error instanceof ServerError) {
            return Promise.resolve(new FinalResponse(null, message));
        }

        const { response } = error as AxiosError;
        if (response) {
            const { status, data } = response;
            if (status === 422) {
                return Promise.resolve(
                    new FinalResponse(
                        null,
                        this.acceptHydra
                            ? onAddEditErrorResponseHydra(data)
                            : onAddEditErrorResponseJson(data)
                    )
                );
            }
        }

        return Promise.resolve(new FinalResponse(null, message));
    }

    protected static getPatchRequestConfig<P = null>(): AxiosRequestConfig {
        const config: AxiosRequestConfig = {
            transformRequest: [
                (payload: P, headers: SimpleObject<string>) =>
                    this.acceptHydra
                        ? // on patch request,
                          // hydra only accept particular MIME type,
                          // so we're using request transformer;
                          // to change content-type header
                          onUpdateRequestHydra(payload, headers)
                        : () => {},
            ],
        };

        return config;
    }

    public static toResourceUrl(id: number): string {
        return `${this.PATH}/${id}`;
    }
}
