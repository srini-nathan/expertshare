import React from "react";
import translations from "./translations";
import { ModuleConfig } from "../AppModule/models";
import AdminModuleRouter from "./AdminModuleRouter";
import { navigation } from "./navigation";

const moduleConfig: ModuleConfig = {
    id: "admin-module",
    translations,
    router: <AdminModuleRouter key={"admin-module-router"} path={"/admin/*"} />,
    navigation,
};

export default moduleConfig;
