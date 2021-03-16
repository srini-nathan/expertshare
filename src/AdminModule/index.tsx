import translations from "./translations";
import { ModuleConfigInterface } from "../AppModule/models";
import { routers } from "./routers";
import { navigation } from "./navigation";

export const adminModuleConfig: ModuleConfigInterface = {
    id: "admin-module",
    translations,
    routers,
    navigation,
};
