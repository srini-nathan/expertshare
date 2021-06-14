import React from "react";
import { Router } from "@reach/router";
import {
    KitchenSink,
    UserProfilePage,
    MyProfilePage,
    ContainerOverview,
    // SessionDetailsPage,
    ConferenceGrid,
    ConferenceAddEdit,
    SessionAddEdit,
    EventAgenda,
    SessionDetailsPage,
    AttendeeOverview,
    OnBoardingPage,
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
                    <AttendeeOverview path={"attendee"} />
                    <AttendeeOverview path={"attendee/:view"} />
                    <UserProfilePage path={"attendee/:id/show"} />
                    <OnBoardingPage path={"onboarding"} />
                </Router>
            );
        },
    },
];

export default routers;
