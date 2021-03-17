import React, { FC, useState } from "react";
import { Redirect, navigate, RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import { appRouters } from "./bootstrap";
import "./assets/scss/app.scss";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter } from "./models";
import {
    AuthContext,
    logoutAction,
} from "./Authentication/context/AuthContext";

const Home: FC<RouteComponentProps> = (): JSX.Element => {
    const { state, dispatch } = React.useContext(AuthContext);
    const { t } = useTranslation();

    const handleLogoutEvent = async () => {
        await logoutAction(dispatch);
    };
    if (state.isAuthenticated) {
        return (
            <h2>
                Hi {t("AppModule:global.name")} Authenticated
                <button onClick={handleLogoutEvent}>Logout</button>
            </h2>
        );
    }
    navigate("/auth/login");
    return <></>;
};

const App = (): JSX.Element => {
    const [authenticated] = useState(true);
    const dashboardRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "dashboard"
    );
    const authRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "auth"
    );

    if (authenticated) {
        return (
            <DashboardLayout>
                <Router>
                    <Home default path="/" />
                    {dashboardRoutes.map(({ RouterPlug, key, path }) => {
                        return <RouterPlug key={key} path={path} />;
                    })}
                    <Redirect noThrow from="/auth/*" to="/" />
                </Router>
            </DashboardLayout>
        );
    }
    return (
        <AuthLayout>
            <Router>
                {authRoutes.map(({ RouterPlug, key, path }) => {
                    return <RouterPlug key={key} path={path} />;
                })}
            </Router>
            <Redirect noThrow from="/" to="/auth/login" />
        </AuthLayout>
    );
};

export default App;
