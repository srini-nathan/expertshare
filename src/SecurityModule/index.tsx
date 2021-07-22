import { routers } from "./routers";
import { ModuleConfig } from "../AppModule/models";
import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const securityModuleConfig: ModuleConfig<AppNavigationItemProps> = {
    id: "security-module",
    routers,
};
