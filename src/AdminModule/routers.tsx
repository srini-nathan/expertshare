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
    ContainerList,
} from "./pages";
import { ModuleRouter } from "../AppModule/models";
import { ContainerAddEdit } from "./pages/ContainerPage/ContainerAddEdit";

export const routers: ModuleRouter[] = [
    {
        key: "admin-module-main-router",
        path: "/admin/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <IndexPage path={"/"} />
                    <DesignPage path={"design"} />
                    <SettingPage path={"settings"} />
                    <TranslationEditor path={"translations"} />
                    <ClientList path={"client"} />
                    <ClientAddEdit path={"client/new"} />
                    <ClientAddEdit path={"client/:id"} />
                    <ContainerList path={"client/:clientId/container"} />
                    <ContainerAddEdit path={"client/:clientId/container/new"} />
                    <ContainerAddEdit path={"client/:clientId/container/:id"} />
                    <LanguageListPage path={"languages"} />
                    <LanguageAddPage path={"languages/new"} />
                    <LanguageAddPage path={"languages/:id"} />
                </Router>
            );
        },
    },
];
