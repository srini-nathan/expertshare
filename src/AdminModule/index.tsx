import translations from "./translations";
import { ModuleConfig } from "../AppModule/models";
import { routers } from "./routers";
import { navigation } from "./navigation";
import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const adminModuleConfig: ModuleConfig<AppNavigationItemProps> = {
    id: "admin-module",
    translations,
    routers,
    navigation,
};
