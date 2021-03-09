import translations from "./translations";
import { routers } from "./routers";
import { ModuleConfigInterface } from "../AppModule/models";

const config: ModuleConfigInterface = {
    id: "security-module",
    translations,
    routers,
};

export default config;
