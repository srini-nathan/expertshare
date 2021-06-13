import { SimpleObject } from "../../AppModule/models";

export type I18nData = SimpleObject<string>;
export type I18nMap = { [locale: string]: I18nData };
