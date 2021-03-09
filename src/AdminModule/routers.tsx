import React from "react";
import { Router } from "@reach/router";
import { IndexPage, DesignPage, SettingPage, TranslationPage } from "./pages";
import { ModuleRouter } from "../AppModule/models";

export const routers: ModuleRouter[] = [
    {
        key: "admin-module-main-router",
        path: "/admin/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <IndexPage default path={"/"}></IndexPage>
                    <DesignPage path={"/design"}></DesignPage>
                    <SettingPage path={"/settings"}></SettingPage>
                    <TranslationPage path={"/translation"}></TranslationPage>
                </Router>
            );
        },
    },
];
