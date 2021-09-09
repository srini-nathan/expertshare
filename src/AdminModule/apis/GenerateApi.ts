import { AxiosResponse } from "axios";
import { I18nData } from "../models/I18nData";
import { API } from "../../AppModule/apis/API";
import { route, ROUTES } from "../../config";
import { API_HOST, APP_ENV } from "../../AppModule/config/app-env";

import * as translations from "../../translations";

const GENERATE_TRANSLATION = "static/translations/{containerId}/{locale}.json";
const GENERATED_STYLE = "static/css/{id}_style.css";

export abstract class GenerateApi extends API {
    public static async getTranslations(
        containerId: number,
        locale: string
    ): Promise<AxiosResponse<I18nData>> {
        if (APP_ENV === "development") {
            const allTrans = translations;
            const containerTransName = `container${containerId}`;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const containerTrans = allTrans[containerTransName] as any;
            const i18n: I18nData = containerTrans[locale];
            return new Promise((resolve, reject) => {
                if (!i18n) {
                    reject();
                    throw new Error(
                        `Translation not exist for locale ${locale} on container#${containerId}`
                    );
                }
                resolve({ data: i18n } as AxiosResponse<I18nData>);
            });
        }
        return this.makeGet<I18nData>(
            route(GENERATE_TRANSLATION, {
                locale,
                containerId,
            }),
            {},
            {
                baseURL: "/",
            }
        );
    }

    public static async getStyle(
        containerId: number
    ): Promise<AxiosResponse<any>> {
        if (APP_ENV === "development") {
            return this.makeGet<I18nData>(
                route(ROUTES.api_generate_styles, {
                    id: containerId,
                }),
                {},
                {
                    baseURL: API_HOST,
                }
            );
        }
        return this.makeGet<I18nData>(
            route(GENERATED_STYLE, {
                id: containerId,
            }),
            {},
            {
                baseURL: "/",
            }
        );
    }
}
