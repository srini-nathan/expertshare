import React from "react";
import { Router } from "@reach/router";
import {
    KitchenSink,
    UserProfilePage,
    MyProfilePage,
    ContainerOverview,
    ConferenceGrid,
    ConferenceAddEdit,
    SessionAddEdit,
    EventAgenda,
} from "./pages";
import { ModuleRouter } from "./models";

export const routers: ModuleRouter[] = [
    {
        key: "app-module-kitchen-sink-router",
        path: "/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <KitchenSink path={"kitchen-sink"} />
                    <MyProfilePage path={"my-profile"} />
                    <UserProfilePage path={"user-profile/:id"} />
                    <ContainerOverview path={"containers/overview"} />
                    <ConferenceGrid path={"conferences"} />
                    <ConferenceGrid path={"conferences/:view"} />
                    <ConferenceAddEdit path={"conference/new"} />
                    <ConferenceAddEdit path={"conference/:id"} />
                    <SessionAddEdit path={"sessions/:conferenceId/new"} />
                    <SessionAddEdit path={"sessions/:conferenceId/:id"} />
                    <EventAgenda path={"conferences/:id/agenda"} />
                </Router>
            );
        },
    },
];

export default routers;
