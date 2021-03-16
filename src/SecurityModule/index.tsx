import translations from "./translations";
import { routers } from "./routers";
import { ModuleConfigInterface } from "../AppModule/models";

export const securityModuleConfig: ModuleConfigInterface = {
    id: "security-module",
    translations,
    routers,
};
