import React from "react";
import translations from "./translations";
import ModuleConfig from "../SharedModule/models/ModuleConfig";
import AdminModuleRouter from "./AdminModuleRouter";

const moduleConfig: ModuleConfig = {
    id: "admin-module",
    translations,
    router: <AdminModuleRouter key={"admin-module-router"} path={"/admin/*"} />,
};

export default moduleConfig;
