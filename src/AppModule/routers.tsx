import React from "react";
import { Router } from "@reach/router";
import { KitchenSink } from "./pages/kitchen-sink";
import { ModuleRouter } from "./models";

export const routers: ModuleRouter[] = [
    {
        key: "app-module-kitchen-sink-router",
        path: "/kitchen-sink/*",
        layout: "dashboard",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <KitchenSink path={"/"} />
                </Router>
            );
        },
    },
];

export default routers;
