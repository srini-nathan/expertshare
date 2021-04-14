import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { ListResponse } from "../../AppModule/models";
import { axios } from "../../AppModule/config/axios";

export abstract class ContainerApi extends EntityAPI {
    protected static PATH = "/api/containers";

    static CONTAINER_LIST_PAGE_PATH = "/admin/container/";

    static CONTAINER_NEW_PAGE_PATH = "/admin/container/new";

    public static async findAllContainersByClient<R>(
        page = 1,
        clientId: number
    ): Promise<ListResponse<R>> {
        return axios.get(`${this.PATH}?page=${page}&client.id=${clientId}`);
    }
}
