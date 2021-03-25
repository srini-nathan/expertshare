import React from "react";
import { Router } from "@reach/router";
import {
    IndexPage,
    DesignPage,
    SettingPage,
    TranslationEditor,
    ClientList,
    ClientAddEdit,
    LanguageListPage,
    LanguageAddPage,
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
                    <TranslationEditor path={"/translations"} />
                    <ClientList path={"/client"} />
                    <ClientAddEdit path={"/client/new"} />
                    <ClientAddEdit path={"/client/:id"} />
                    <LanguageListPage path={"/languages"} />
                    <LanguageAddPage path={"/languages/new"} />
                </Router>
            );
        },
    },
];
