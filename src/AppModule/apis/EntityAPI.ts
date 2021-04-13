import { AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "./API";
import { ACCEPTABLE_RESPONSE } from "../config/app-env";
import { AcceptableResponse, ListResponse, SimpleObject } from "../models";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
    onUpdateRequestHydra,
} from "./transformer";

export abstract class EntityAPI extends API {
    protected static PATH = "/";

    public static async findById<R>(id: number): Promise<R> {
        const res: AxiosResponse<R> = await this.makeGet<R>(
            `${this.PATH}/${id}`
        );
        return res.data;
    }

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

    public static async delete<R>(id: number): Promise<R> {
        const res: AxiosResponse<R> = await this.makeDelete(
            `${this.PATH}/${id}`
        );
        return res.data;
    }

    public static async create<R, P>(data: P): Promise<R> {
        const res: AxiosResponse<R> = await this.makePost<R, P>(
            this.PATH,
            data
        );
        return res.data;
    }

    public static async update<R, P>(id: number, data: P): Promise<R> {
        let config = {};
        // on patch request, hydra only accept particular MIME type,
        // so we're using request transformer to change content-type header
        if (AcceptableResponse.isHydra(ACCEPTABLE_RESPONSE)) {
            config = {
                transformRequest: [
                    (payload: P, headers: SimpleObject<string>) =>
                        onUpdateRequestHydra(payload, headers),
                ],
            };
        }
        const res: AxiosResponse<R> = await this.makePatch<R, P>(
            `${this.PATH}/${id}`,
            JSON.stringify(data),
            {},
            config
        );
        return res.data;
    }

    public static async replace<R, P>(id: number, data: P): Promise<R> {
        const res: AxiosResponse<R> = await this.makePut<R, P>(
            `${this.PATH}/${id}`,
            data
        );
        return res.data;
    }
}
