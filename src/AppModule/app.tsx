import React, { FC } from "react";
import { Link, RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import BootstrapProvider from "@bootstrap-styled/provider";
import defaultTheme from "../SharedModule/theme/expertshare";
import { moduleRouters } from "./bootstrap";
import "./app.scss";

const Home: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    return <h2>Hi {t("AppModule:global.name")}</h2>;
};

const App = (): JSX.Element => {
    return (
        <BootstrapProvider theme={defaultTheme}>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">AppModule</Link>
                        </li>
                        <li>
                            <Link to="/admin">AdminModule</Link>
                        </li>
                        <li>
                            <Link to="/auth">Security Module</Link>
                        </li>
                    </ul>
                </nav>
                <Router>
                    <Home path="/" />
                    {moduleRouters.map((module) => {
                        return module;
                    })}
                </Router>
            </div>
        </BootstrapProvider>
    );
};

export default App;
