import translations from "./translations";
import { ModuleConfigInterface } from "../AppModule/models";
import { routers } from "./routers";
import { navigation } from "./navigation";

const config: ModuleConfigInterface = {
    id: "admin-module",
    translations,
    routers,
    navigation,
};

export default config;
