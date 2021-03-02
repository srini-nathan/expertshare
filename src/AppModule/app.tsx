import React, { FC } from "react";
import { navigate, RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import BootstrapProvider from "@bootstrap-styled/provider";
import defaultTheme from "../SharedModule/theme/expertshare";
import { moduleRouters } from "./bootstrap";
import "./assets/scss/app.scss";
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
    return (
        <BootstrapProvider theme={defaultTheme}>
            <Router>
                <Home path="/" />
                {moduleRouters.map((module) => {
                    return module;
                })}
            </Router>
        </BootstrapProvider>
    );
};

export default App;
