import { AxiosResponse } from "axios";
import { I18nData } from "../models/I18nData";
import { API } from "../../AppModule/apis/API";
import { route, ROUTES } from "../../config";

const { api_generate_export_translation: GENERATE_TRANSLATION } = ROUTES;

export abstract class GenerateApi extends API {
    public static async getTranslations(
        containerId: number,
        locale: string
    ): Promise<AxiosResponse<I18nData>> {
        return this.makeGet<I18nData>(
            route(GENERATE_TRANSLATION, {
                locale,
                containerId,
            })
        );
    }
}
