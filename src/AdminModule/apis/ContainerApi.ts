import { AxiosError } from "axios";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import {
    FinalResponse,
    ListResponse,
    ServerError,
} from "../../AppModule/models";

export abstract class ContainerApi extends EntityAPI {
    protected static PATH = "/api/containers";

    static CONTAINER_LIST_PAGE_PATH = "/admin/container/";

    static CONTAINER_NEW_PAGE_PATH = "/admin/container/new";

    static CONFIGURATION_TYPE = "configuration-type";

    public static async getConfigiration<R>(
        id: number
    ): Promise<FinalResponse<ListResponse<R> | null>> {
        return this.makeGet<R>(`${this.PATH}/${id}/${this.CONFIGURATION_TYPE}`)
            .then(({ data }) => {
                return this.response<R>(data);
            })
            .catch((error: AxiosError | ServerError) =>
                this.handleErrorDuringCreatingOrUpdating(error)
            );
    }
}
