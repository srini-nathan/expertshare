import React from "react";
import { Router } from "@reach/router";
import { LoginPage, RegisterPage } from "./pages";
import { ModuleRouter } from "../AppModule/models";

export const routers: ModuleRouter[] = [
    {
        key: "security-module-main-router",
        path: "/auth/*",
        layout: "auth",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <LoginPage path={"/login"}></LoginPage>
                    <RegisterPage path={"/register"}></RegisterPage>
                </Router>
            );
        },
    },
];
