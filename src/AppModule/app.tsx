import React, { FC } from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import BootstrapProvider from "@bootstrap-styled/provider";
import defaultTheme from "../SharedModule/theme/expertshare";
import { moduleRouters } from "./bootstrap";
import "./assets/scss/app.scss";

const Home: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    return <h2>Hi {t("AppModule:global.name")}</h2>;
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
