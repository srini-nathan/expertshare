import React from "react";
import { Router } from "@reach/router";
import {
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    ForgotPasswordConfirmationPage,
    ResetPasswordPage,
    ResetPasswordPageConfirmation,
} from "./pages";
import { ModuleRouter } from "../AppModule/models";

export const routers: ModuleRouter[] = [
    {
        key: "security-module-main-router",
        path: "/auth/*",
        layout: "auth",
        RouterPlug: (): JSX.Element => {
            return (
                <Router>
                    <LoginPage path={"login"} />
                    <RegisterPage path={"register"} />
                    <ForgotPasswordPage path={"forgot-password"} />
                    <ForgotPasswordConfirmationPage
                        path={"forgot-password-email-confirmation"}
                    />
                    <ResetPasswordPage path={"reset-password"} />
                    <ResetPasswordPageConfirmation
                        path={"reset-password-confirmation"}
                    />
                </Router>
            );
        },
    },
];
