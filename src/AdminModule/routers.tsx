import React from "react";
import { Router } from "@reach/router";
import {
    IndexPage,
    DesignPage,
    SettingPage,
    TranslationEditor,
    ClientList,
    ClientAddEdit,
} from "./pages";
import { ModuleRouter } from "../AppModule/models";

export const routers: ModuleRouter[] = [
    {
        key: "admin-module-main-router",
        path: "/admin/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <IndexPage default path={"/"} />
                    <DesignPage path={"/design"} />
                    <SettingPage path={"/settings"} />
                    <TranslationEditor path={"/translation"} />
                    <TranslationEditor path={"/translation"} />
                    <ClientList path={"/client"} />
                    <ClientAddEdit path={"/client/new"} />
                    <ClientAddEdit path={"/client/:id"} />
                </Router>
            );
        },
    },
];
