import React, { FC } from "react";
import { Redirect, RouteComponentProps, Router, Location } from "@reach/router";
import { appRouters } from "./bootstrap";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppConfiguration } from "./layouts/AppConfiguration";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter } from "./models";
import AppProvider from "./Contexts/AppContext";
import { AuthContext } from "../SecurityModule/context/AuthContext";
import { AppLoader } from "./components";

import "./assets/scss/bootstrap.scss";
import "./assets/scss/main.scss";
import { AuthState } from "../SecurityModule/models";

interface Props {
    location: {
        pathname: string;
    };
    action: () => void;
}
class OnRouteChangeWorker extends React.Component<Props> {
    componentDidUpdate(prevProps: Props) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.props.action();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}

interface Props2 {
    action: () => void;
}
const OnRouteChange = ({ action }: Props2) => (
    <Location>
        {({ location }) => (
            <OnRouteChangeWorker location={location} action={action} />
        )}
    </Location>
);

const Home: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;

    return (
        <h2>
            Hi{" "}
            {
                // @TODO: what to do with, if user is null
                user && user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : ""
            }
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
            <AppProvider>
                <AppConfiguration>
                    <DashboardLayout>
                        <Router primary={false}>
                            <Redirect from="/" to="home" noThrow />
                            <Home path="home" />
                            {dashboardRoutes.map(
                                ({ RouterPlug, key, path }) => {
                                    return <RouterPlug key={key} path={path} />;
                                }
                            )}
                        </Router>
                        <OnRouteChange
                            action={() => {
                                window.scrollTo(0, 0);
                            }}
                        />
                    </DashboardLayout>
                </AppConfiguration>
            </AppProvider>
        );
    }

    return (
        <AuthLayout>
            <Router primary={false}>
                <Redirect from="/home" to="/auth" />
                <Redirect from="/" to="/auth" noThrow />
                {authRoutes.map(({ RouterPlug, key, path }) => {
                    return <RouterPlug key={key} path={path} />;
                })}
            </Router>
        </AuthLayout>
    );
};

export default App;
