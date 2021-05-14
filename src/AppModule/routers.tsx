import React from "react";
import { Router } from "@reach/router";
import { KitchenSink, KitchenSinkDani } from "./pages";
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
                    <KitchenSinkDani path={"/dani"} />
                </Router>
            );
        },
    },
];

export default routers;
