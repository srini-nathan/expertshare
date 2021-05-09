import React from "react";
import { Router } from "@reach/router";
import {
    IndexPage,
    DesignPage,
    SettingPage,
    TranslationAddEdit,
    ClientList,
    ClientAddEdit,
    LanguageListPage,
    LanguageAddEditPage,
    ContainerList,
    UserGroupListPage,
    UserGroupAddEditPage,
    EmailTemplateListPage,
    EmailTemplateAddEditPage,
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
                    <TranslationAddEdit path={"translations"} />
                    <ClientList path={"clients"} />
                    <ClientAddEdit path={"clients/new"} />
                    <ClientAddEdit path={"clients/:id"} />
                    <ContainerList path={"clients/:clientId/containers"} />
                    <ContainerAddEdit
                        path={"clients/:clientId/containers/new"}
                    />
                    <ContainerAddEdit
                        path={"clients/:clientId/containers/:id"}
                    />
                    <LanguageListPage path={"languages"} />
                    <LanguageAddEditPage path={"languages/new"} />
                    <LanguageAddEditPage path={"languages/:id"} />
                    <UserGroupListPage path={"user-groups"} />
                    <UserGroupAddEditPage path={"user-groups/new"} />
                    <UserGroupAddEditPage path={"user-groups/:id"} />
                    <EmailTemplateListPage path={"email-templates"} />
                    <EmailTemplateAddEditPage path={"email-templates/new"} />
                    <EmailTemplateAddEditPage path={"email-templates/:id"} />
                </Router>
            );
        },
    },
];
