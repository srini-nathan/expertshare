import { AxiosResponse } from "axios";
import { API } from "./API";

export abstract class EntityAPI extends API {
    protected static PATH = "/";

    public static async findById<R>(id: number): Promise<R> {
        const res: AxiosResponse<R> = await this.makeGet<R>(
            `${this.PATH}/${id}`
        );
        return res.data;
    }

    public static async findAll<R>(page = 1, extraParams = {}): Promise<R> {
        const res: AxiosResponse<R> = await this.makeGet<R>(this.PATH, {
            ...extraParams,
            page,
        });

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
