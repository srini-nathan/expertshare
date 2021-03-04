import React from "react";
import translations from "./translations";
import SecurityModuleRouter from "./SecurityModuleRouter";
import { ModuleConfig } from "../AppModule/models";

const moduleConfig: ModuleConfig = {
    id: "security-module",
    translations,
    router: (
        <SecurityModuleRouter key={"security-module-router"} path={"/auth/*"} />
    ),
};

export default moduleConfig;
