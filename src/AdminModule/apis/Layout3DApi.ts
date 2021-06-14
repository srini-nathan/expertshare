import { AxiosError } from "axios";
import { route, ROUTES } from "../../config";
import { EntityAPI } from "../../AppModule/apis/EntityAPI";
import { FinalResponse, ServerError } from "../../AppModule/models";

const { api_aframe_a3d: API_AFRAME_3D } = ROUTES;

export abstract class Layout3DApi extends EntityAPI {
    protected static GET_COLLECTION = API_AFRAME_3D;

    public static async exportLayout3DData(
        containerId: number,
        locale: string
    ): Promise<any> {
        return this.makeGet<any>(route(API_AFRAME_3D, { containerId, locale }))
            .then(({ data }) => {
                return data;
            })
            .catch((error: AxiosError | ServerError) => {
                const { message } = error;
                return Promise.resolve(new FinalResponse(null, message));
            });
    }
}
