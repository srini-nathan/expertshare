import React, { FC } from "react";
import { Redirect, RouteComponentProps, Router, Location } from "@reach/router";
import { appRouters } from "./bootstrap";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppConfiguration } from "./layouts/AppConfiguration";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter } from "./models";
import AppProvider from "./contexts/AppContext";
import { AuthContext } from "../SecurityModule/contexts/AuthContext";
import { AppLoader, AppWelcomeModal } from "./components";

import "./assets/scss/bootstrap.scss";
import "./assets/scss/main.scss";

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
    return <h2>Hi</h2>;
};

const App = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const [showWelcomeModal, setShowWelcomeModal] = React.useState(true);
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

    const showedWelcomeModal = localStorage.getItem("showed-welcome-modal");
    // if (!showedWelcomeModal) {
    //     // eslint-disable-next-line no-console
    //     console.log("localstorage value:::", showedWelcomeModal);
    //     setShowWelcomeModal(true);
    //     localStorage.setItem("showed-welcome-modal", "true");
    // }

    // eslint-disable-next-line no-console
    // console.log("handle close clicked:::", showedWelcomeModal);
    // localStorage.setItem("showed-welcome-modal", "");
    if (state.isAuthenticated) {
        return (
            <>
                <AppProvider>
                    <AppConfiguration>
                        <DashboardLayout>
                            <Router primary={false}>
                                <Redirect
                                    from="/"
                                    to="/conferences/grid"
                                    noThrow
                                />
                                <Home path="home" />
                                {dashboardRoutes.map(
                                    ({ RouterPlug, key, path }) => {
                                        return (
                                            <RouterPlug key={key} path={path} />
                                        );
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
                <AppWelcomeModal
                    show={(!showedWelcomeModal && showWelcomeModal) || true}
                    handleClose={() => {
                        // eslint-disable-next-line no-console
                        console.log("handle close clicked");
                        setShowWelcomeModal(false);
                        localStorage.setItem("showed-welcome-modal", "true");
                    }}
                />
            </>
        );
    }

    return (
        <AuthLayout>
            <Router primary={false}>
                {authRoutes.map(({ RouterPlug, key, path }) => {
                    return <RouterPlug key={key} path={path} />;
                })}
                <Redirect noThrow from="*" to="/auth" />
            </Router>
        </AuthLayout>
    );
};

export default App;
