import React from "react";
import { Router } from "@reach/router";
import {
    IndexPage,
    TranslationAddEdit,
    ClientList,
    ClientAddEdit,
    LanguageListPage,
    LanguageAddEditPage,
    ContainerList,
    UserGroupListPage,
    UserGroupAddEditPage,
    AdministrationGeneralSetting,
    AdministrationDesign,
    EmailTemplateListPage,
    EmailTemplateAddEditPage,
    UserListPage,
    UserAddEditPage,
} from "./pages";
import { ModuleRouter } from "../AppModule/models";
import { ContainerAddEdit } from "./pages/ContainerPage/ContainerAddEdit";
import { UserFieldAddEditPage, UserFieldListPage } from "./pages/UserFieldPage";
import { AttendeeOverview } from "./pages/AttendeePage";

export const routers: ModuleRouter[] = [
    {
        key: "admin-module-main-router",
        path: "/admin/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <IndexPage path={"/"} />
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
                    <AdministrationGeneralSetting path={"settings"} />
                    <AdministrationDesign path={"design"} />
                    <EmailTemplateListPage path={"email-templates"} />
                    <EmailTemplateAddEditPage path={"email-templates/new"} />
                    <EmailTemplateAddEditPage path={"email-templates/:id"} />
                    <UserFieldListPage path={"user-fields"} />
                    <UserFieldAddEditPage path={"user-fields/new"} />
                    <UserFieldAddEditPage path={"user-fields/:id"} />
                    <AttendeeOverview path={"attendees"}></AttendeeOverview>
                    <UserListPage path={"users"} />
                    <UserAddEditPage path={"users/new"} />
                    <UserAddEditPage path={"users/:id"} />
                </Router>
            );
        },
    },
];
