import translations from "./translations";
import { routers } from "./routers";
import { ModuleConfig } from "../AppModule/models";

export const securityModuleConfig: ModuleConfig = {
    id: "security-module",
    translations,
    routers,
};
