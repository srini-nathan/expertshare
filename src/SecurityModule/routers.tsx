import React from "react";
import { Redirect, Router } from "@reach/router";
import { LoginPage, RegisterPage, ResetPasswordPage } from "./pages";
import { ModuleRouter } from "../AppModule/models";

export const routers: ModuleRouter[] = [
    {
        key: "security-module-main-router",
        path: "/auth/*",
        layout: "auth",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <Redirect from={"/"} to={"login"} noThrow />
                    <LoginPage path={"login"} />
                    <RegisterPage path={"register"} />
                    <ResetPasswordPage path={"reset-password"} />
                </Router>
            );
        },
    },
];
