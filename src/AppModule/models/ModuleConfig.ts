import { Resource } from "i18next";
import { ModuleRouter } from "./ModuleRouter";

export interface ModuleConfig {
    id: string;
    translations: Resource;
    routers?: ModuleRouter[];
    navigation?: any[];
}
