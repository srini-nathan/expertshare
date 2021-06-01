import React from "react";
import { Router } from "@reach/router";
import {
    KitchenSink,
    UserProfilePage,
    MyProfilePage,
    ContainerOverview,
    SessionDetailsPage,
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
                    <SessionDetailsPage
                        path={"conference/:id/session/:number"}
                    />
                    <ContainerOverview path={"containers/overview"} />
                </Router>
            );
        },
    },
];

export default routers;
