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
    SessionCategoryListPage,
    SessionCategoryAddEditPage,
    AFrameRoomGrid,
    AFrameRoomAddEdit,
    AFramePanelGrid,
    AFramePanelAddEdit,
    InfoPageListPage,
    InfoPageAddEditPage,
    NavigationListPage,
    NavigationAddEditPage,
    LiveVotingAddEditPage,
} from "./pages";
import { Layout3D } from "../Layout3DModule";
import { ModuleRouter } from "../AppModule/models";
import { ContainerAddEdit } from "./pages/ContainerPage/ContainerAddEdit";
import { UserFieldAddEditPage, UserFieldListPage } from "./pages/UserFieldPage";

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
                    <ContainerList path={"containers"} />
                    <ContainerAddEdit
                        path={"clients/:clientId/containers/new"}
                    />
                    <ContainerAddEdit path={"containers/new"} />
                    <ContainerAddEdit
                        path={"clients/:clientId/containers/:id"}
                    />
                    <ContainerAddEdit path={"containers/:id"} />
                    <LanguageListPage path={"languages"} />
                    <Layout3D path={"layout3d"} />
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
                    <UserListPage path={"users"} />
                    <UserAddEditPage path={"users/new"} />
                    <UserAddEditPage path={"users/:id"} />
                    <SessionCategoryListPage path={"session-categories"} />
                    <SessionCategoryAddEditPage
                        path={"session-categories/:id"}
                    />
                    <SessionCategoryAddEditPage
                        path={"session-categories/new"}
                    />
                    <AFrameRoomGrid path={"rooms/:view"} />
                    <AFrameRoomAddEdit path={"room/new"} />
                    <AFrameRoomAddEdit path={"room/:id"} />
                    <AFramePanelGrid path={"rooms"} />
                    <AFramePanelGrid path={"room/:roomId/:panelType"} />
                    <AFramePanelGrid path={"panels/:view"} />
                    <AFramePanelAddEdit path={"room/:roomId/:panelType/new"} />
                    <AFramePanelAddEdit path={"room/:roomId/:panelType/:id"} />
                    <InfoPageListPage path={"info-pages"} />
                    <InfoPageAddEditPage path={"info-pages/new"} />
                    <InfoPageAddEditPage path={"info-pages/:id"} />
                    <NavigationListPage path={"navigations"} />
                    <NavigationAddEditPage path={"navigations/new"} />
                    <NavigationAddEditPage path={"navigations/:key"} />
                    <LiveVotingAddEditPage path={"live-votes/:sessionId/new"} />
                    <LiveVotingAddEditPage path={"live-votes/:sessionId/:id"} />
                </Router>
            );
        },
    },
];
