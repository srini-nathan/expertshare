import { AxiosRequestConfig, AxiosResponse } from "axios";
import { API } from "./API";
import { ACCEPTABLE_RESPONSE } from "../config/app-env";
import { AcceptableResponse, ListResponse } from "../models";
import { onFindAllResponseHydra, onFindAllResponseJson } from "./transformer";

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
        let config: AxiosRequestConfig = {};

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

    public static async create<R, P>(data: P): Promise<R> {
        const res: AxiosResponse<R> = await this.makePost<R, P>(
            this.PATH,
            data
        );
        return res.data;
    }

    public static async update<R, P>(id: number, data: P): Promise<R> {
        const res: AxiosResponse<R> = await this.makePatch<R, P>(
            `${this.PATH}/${id}`,
            data
        );
        return res.data;
    }
}
