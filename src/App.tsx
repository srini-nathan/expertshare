import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./i18n/i18n";
import { useTranslation } from "react-i18next";

function Home(): JSX.Element {
    return <h2>Home</h2>;
}

function About(): JSX.Element {
    const { t } = useTranslation();
    return <h2>{t("expertShare.title")}</h2>;
}

function Users(): JSX.Element {
    return <h2>Users</h2>;
}

const App = (): JSX.Element => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/users">
                        <Users />
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
