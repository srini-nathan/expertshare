import React from "react";
import { Redirect, Router } from "@reach/router";
import {
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    ForgotPasswordConfirmationPage,
    ResetPasswordPage,
} from "./pages";
import { ModuleRouter } from "../AppModule/models";
import { SocialLoginRedirectPage } from "./pages/SocialLoginRedirectPage/SocialLoginRedirectPage";

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
                    <SocialLoginRedirectPage path={"jwt/:token"} />
                    <RegisterPage path={"register"} />
                    <ForgotPasswordPage path={"forgot-password"} />
                    <ForgotPasswordConfirmationPage
                        path={"forgot-password-email-confirmation"}
                    />
                    <ResetPasswordPage path={"reset-password"} />
                </Router>
            );
        },
    },
];
