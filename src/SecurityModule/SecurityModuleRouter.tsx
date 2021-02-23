import React, { FC, PropsWithChildren } from "react";
import { Link, RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import { IndexPage, LoginPage, RegisterPage } from "./pages";

const SecurityModuleRouter: FC<PropsWithChildren<RouteComponentProps>> = (
    props
): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("AdminModule:global.name")}</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/auth">Home</Link>
                    </li>
                    <li>
                        <Link to="/auth/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/auth/register">Register</Link>
                    </li>
                </ul>
            </nav>
            <Router>
                <IndexPage default path={"/"}></IndexPage>
                <LoginPage path={"/login"}></LoginPage>
                <RegisterPage path={"/register"}></RegisterPage>
            </Router>
            {props.children}
        </div>
    );
};

export default SecurityModuleRouter;
