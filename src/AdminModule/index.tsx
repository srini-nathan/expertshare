import translations from "./translations";
import { ModuleConfig } from "../AppModule/models";
import { routers } from "./routers";
import { navigation } from "./navigation";

export const adminModuleConfig: ModuleConfig = {
    id: "admin-module",
    translations,
    routers,
    navigation,
};
