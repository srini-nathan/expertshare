import React from "react";
import { Router } from "@reach/router";
import {
    TranslationAddEdit,
    ClientList,
    ClientAddEdit,
    ClientSettings,
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
    ExhibitorCategoryListPage,
    ExhibitorCategoryAddEditPage,
    AFrameRoomGrid,
    AFrameRoomAddEdit,
    AFramePanelGrid,
    AFramePanelAddEdit,
    InfoPageListPage,
    InfoPageAddEditPage,
    NavigationListPage,
    NavigationAddEditPage,
    LiveVoteAddEditPage,
    LiveVoteDetailResultPage,
    LiveVoteOverviewResultPage,
    LiveVoteListPage,
    ExhibitorAddEditPage,
    ExhibitorListPage,
    ExhibitorDetailPage,
    ExhibitorProductAddEditPage,
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
                    <TranslationAddEdit path={"translations"} />
                    <ClientList path={"clients"} />
                    <ClientAddEdit path={"clients/new"} />
                    <ClientAddEdit path={"clients/:id"} />
                    <ClientSettings path={"clients/:clientId/settings"} />
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
                    <ExhibitorCategoryListPage path={"exhibitor-categories"} />
                    <ExhibitorCategoryAddEditPage
                        path={"exhibitor-categories/:id"}
                    />
                    <ExhibitorCategoryAddEditPage
                        path={"exhibitor-categories/new"}
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
                    <LiveVoteListPage path={"live-votes"} />
                    <LiveVoteAddEditPage path={"live-votes/:id"} />
                    <LiveVoteAddEditPage
                        path={"live-votes/:conferenceId/:sessionId/new"}
                    />
                    <LiveVoteAddEditPage
                        path={"live-votes/:conferenceId/:sessionId/:id"}
                    />
                    <LiveVoteDetailResultPage
                        path={"live-votes-result/:questionId"}
                    />
                    <LiveVoteDetailResultPage
                        path={
                            "live-votes-result/:conferenceId/:sessionId/:questionId"
                        }
                    />
                    <LiveVoteOverviewResultPage
                        path={"live-votes-result/:questionId/overview"}
                    />
                    <LiveVoteOverviewResultPage
                        path={
                            "live-votes-result/:conferenceId/:sessionId/:questionId/overview"
                        }
                    />
                    <LiveVoteOverviewResultPage
                        path={
                            "live-votes-result/:conferenceId/:sessionId/:questionId/overview/:viewMode"
                        }
                    />
                    <LiveVoteOverviewResultPage
                        path={
                            "live-votes-result/:questionId/overview/:viewMode"
                        }
                    />
                    <ExhibitorListPage path={"exhibitors"} />
                    <ExhibitorAddEditPage path={"exhibitors/new"} />
                    <ExhibitorAddEditPage path={"exhibitors/:id"} />
                    <ExhibitorDetailPage path={"exhibitors/:id/detail"} />
                    <ExhibitorDetailPage path={"exhibitors/:id/detail/:view"} />
                    <ExhibitorProductAddEditPage
                        path={"exhibitors/:parentId/products/new"}
                    />
                    <ExhibitorProductAddEditPage
                        path={"exhibitors/:parentId/products/:id"}
                    />
                </Router>
            );
        },
    },
];
