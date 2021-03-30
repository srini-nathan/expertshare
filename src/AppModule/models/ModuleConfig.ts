import { Resource } from "i18next";
import { ModuleRouter } from "./ModuleRouter";

export interface ModuleConfig<T> {
    id: string;
    translations: Resource;
    routers?: ModuleRouter[];
    // @TODO: define type of following navigation key
    navigation?: T[];
}
