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
                        <Link to="">Home</Link>
                    </li>
                    <li>
                        <Link to="login">Login</Link>
                    </li>
                    <li>
                        <Link to="register">Register</Link>
                    </li>
                </ul>
            </nav>
            <Router>
                <IndexPage default />
                <LoginPage path={"/login"}></LoginPage>
                <RegisterPage path={"/register"}></RegisterPage>
            </Router>
            {props.children}
        </div>
    );
};

export default SecurityModuleRouter;
