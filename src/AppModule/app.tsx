import React, { FC } from "react";
import { Redirect, RouteComponentProps, Router, navigate } from "@reach/router";
import { appRouters } from "./bootstrap";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppConfiguration } from "./layouts/AppConfiguration";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter } from "./models";
import {
    AuthContext,
    logoutAction,
} from "./Authentication/context/AuthContext";
import { AppLoader } from "./components";

import "./assets/scss/bootstrap.scss";
import "./assets/scss/main.scss";

const Home: FC<RouteComponentProps> = (): JSX.Element => {
    const { dispatch } = React.useContext(AuthContext);

    const handleLogoutEvent = async () => {
        await logoutAction(dispatch);
    };

    return (
        <h2>
            Hi Authenticated User
            <button onClick={handleLogoutEvent}>Logout</button>
        </h2>
    );
};

const App = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const dashboardRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "dashboard"
    );
    const authRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "auth"
    );

    if (state.isAuthenticated === null) {
        return (
            <div className={"vh-100 vw-100"}>
                <AppLoader />
            </div>
        );
    }

    if (state.isAuthenticated) {
        return (
            <AppConfiguration state={state}>
                <DashboardLayout>
                    <Router>
                        <Redirect from="/" to="home" noThrow />
                        <Home path="home" />
                        {dashboardRoutes.map(({ RouterPlug, key, path }) => {
                            return <RouterPlug key={key} path={path} />;
                        })}
                    </Router>
                </DashboardLayout>
            </AppConfiguration>
        );
    }

    if (!state.isAuthenticated) {
        navigate("/auth/login").then();
    }

    return (
        <AuthLayout>
            <Router>
                {authRoutes.map(({ RouterPlug, key, path }) => {
                    return <RouterPlug key={key} path={path} />;
                })}
            </Router>
        </AuthLayout>
    );
};

export default App;
