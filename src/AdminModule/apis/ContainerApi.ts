import { AxiosRequestConfig } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { AcceptableResponse, ListResponse } from "../../AppModule/models";
import { axios } from "../../AppModule/config/axios";
import { ACCEPTABLE_RESPONSE } from "../../AppModule/config/app-env";
import {
    onFindAllResponseHydra,
    onFindAllResponseJson,
} from "../../AppModule/apis/transformer";

export abstract class ContainerApi extends EntityAPI {
    protected static PATH = "/api/containers";

    static CONTAINER_LIST_PAGE_PATH = "/admin/container/";

    static CONTAINER_NEW_PAGE_PATH = "/admin/container/new";

    public static async findAllContainersByClient<R>(
        page = 1,
        clientId: number
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

        const result = await axios.get(
            `${this.PATH}?page=${page}&client.id=${clientId}`,
            config
        );
        return result.data;
    }
}
