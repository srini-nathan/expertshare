import React, { FC } from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import { appRouters } from "./bootstrap";
import "./assets/scss/app.scss";
import { DashboardLayout } from "./layouts/DashboardLayout";

const Home: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    return (
        <DashboardLayout>
            <h2>Hi {t("AppModule:global.name")}</h2>
        </DashboardLayout>
    );
};

const App = (): JSX.Element => {
    return (
        <Router>
            <Home default path="/" />
            {appRouters.map(({ RouterPlug, key, path }) => {
                return <RouterPlug key={key} path={path} />;
            })}
        </Router>
    );
};

export default App;
