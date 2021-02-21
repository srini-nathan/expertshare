import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./bootstrap";
import "./app.scss";
import { useTranslation } from "react-i18next";
import setupAxiosInterceptors from "../Settings/Config/asiox-interceptor-config";

setupAxiosInterceptors(() => {});

function Home(): JSX.Element {
    const { t } = useTranslation();
    return <h2>Hi {t("global.name")}</h2>;
}

function AdminModule(): JSX.Element {
    const { t } = useTranslation();
    return <h2>Hi {t("AdminModule:global.name")}</h2>;
}

function ShareModule(): JSX.Element {
    const { t } = useTranslation();
    return <h2>Hi {t("SharedModule:global.name")}</h2>;
}

const App = (): JSX.Element => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">AppModule</Link>
                        </li>
                        <li>
                            <Link to="/AdminModule">AdminModule</Link>
                        </li>
                        <li>
                            <Link to="/ShareModule">ShareModule</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/AdminModule">
                        <AdminModule />
                    </Route>
                    <Route path="/ShareModule">
                        <ShareModule />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
