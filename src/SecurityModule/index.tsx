import React from "react";
import translations from "./translations";
import ModuleConfig from "../SharedModule/models/ModuleConfig";
import SecurityModuleRouter from "./SecurityModuleRouter";

const moduleConfig: ModuleConfig = {
    id: "security-module",
    translations,
    router: (
        <SecurityModuleRouter key={"security-module-router"} path={"/auth/*"} />
    ),
};

export default moduleConfig;
