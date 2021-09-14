import React from "react";
import { Router } from "@reach/router";
import {
    UserProfilePage,
    MyProfilePage,
    ContainerOverview,
    ConferenceGrid,
    ConferenceAddEdit,
    SessionAddEdit,
    EventAgenda,
    SessionDetailsPage,
    AttendeeOverview,
    QuestionBoard,
    OnBoardingPage,
    ReloadingPage,
    InfoPage,
    AFramePanelPage,
    WidgetPage,
} from "./pages";
import { ExhibitorListPage, ExhibitorDetailPage } from "../AdminModule/pages";
import { ModuleRouter } from "./models";
import { Layout3D } from "../Layout3DModule";

export const routers: ModuleRouter[] = [
    {
        key: "app-module-kitchen-sink-router",
        path: "/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <InfoPage path={"page/:id/:slugKey"} />
                    <MyProfilePage path={"my-profile"} />
                    <ContainerOverview path={"container"} />
                    <ConferenceGrid path={"event"} />
                    <ConferenceGrid path={"event/:view"} />
                    <ConferenceAddEdit path={"event/create"} />
                    <ConferenceAddEdit path={"event/:id/update"} />
                    <SessionAddEdit
                        path={"event/:conferenceId/session/create"}
                    />
                    <SessionAddEdit
                        path={"event/:conferenceId/session/:id/update"}
                    />
                    <EventAgenda path={"event/:id/agenda"} />
                    <SessionDetailsPage
                        path={"event/:conferenceId/session/:id"}
                    />
                    <ContainerOverview path={"containers/overview"} />
                    <ConferenceGrid path={"conferences"} />
                    <ConferenceGrid path={"conferences/:view"} />
                    <ConferenceAddEdit path={"conference/new"} />
                    <ConferenceAddEdit path={"conference/:id"} />
                    <SessionAddEdit path={"sessions/:conferenceId/new"} />
                    <SessionAddEdit path={"sessions/:conferenceId/:id"} />
                    <EventAgenda path={"conferences/:id/agenda"} />
                    <SessionDetailsPage path={"sessions/:id"} />
                    <AttendeeOverview path={"attendees"} />
                    <AttendeeOverview path={"attendees/:view"} />
                    <AttendeeOverview path={"attendee"} />
                    <AttendeeOverview path={"attendee/:view"} />
                    <UserProfilePage path={"attendee/:id/show"} />
                    <OnBoardingPage path={"onboarding"} />
                    <ReloadingPage path={"reloading"} />
                    <QuestionBoard path={"questionboard"} />
                    <Layout3D path={"a3d"} />
                    <ExhibitorListPage path={"exhibitors"} />
                    <ExhibitorDetailPage path={"exhibitors/:id/detail"} />
                    <ExhibitorDetailPage path={"exhibitors/:id/detail/:view"} />
                    <AFramePanelPage path={"layout3d/:roomId/panel/:id"} />
                    <WidgetPage path={"widget/:type/:id"} />
                </Router>
            );
        },
    },
];

export default routers;
