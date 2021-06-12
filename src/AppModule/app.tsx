import React from "react";
import { Redirect, Router, Location, useMatch } from "@reach/router";
import { appRouters } from "./bootstrap";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppConfiguration } from "./layouts/AppConfiguration";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter } from "./models";
import AppProvider from "./contexts/AppContext";
import { AuthContext } from "../SecurityModule/contexts/AuthContext";
import { useChosenContainer, useNavigator } from "./hooks";
import {
    AppLoader,
    AppPictureInPicture,
    AppYoutubeFrame,
    AppWelcomeModal,
} from "./components";
import { LandingHelper } from "./pages";

import "./assets/scss/bootstrap.scss";
import "./assets/scss/main.scss";
import { useGlobalData } from "./contexts";

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

const AppFullScreenLoader = (): JSX.Element => {
    return (
        <div className={"vh-100 vw-100"}>
            <AppLoader />
        </div>
    );
};
const App = (): JSX.Element => {
    const { status } = useGlobalData();
    const { state } = React.useContext(AuthContext);
    const navigator = useNavigator();
    const { isChosen } = useChosenContainer();
    const [showWelcomeModal, setShowWelcomeModal] = React.useState(true);

    const dashboardRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "dashboard"
    );
    const authRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "auth"
    );
    const overViewPage = useMatch("/container");
    const autoLoginPage = useMatch("/auth/auto-login/:token");
    const isOverViewPage = overViewPage !== null;
    const isAutoLoginPage = autoLoginPage !== null;

    if (status === "LOADING" || state.isAuthenticated === null) {
        return <AppFullScreenLoader />;
    }

    if (!isAutoLoginPage && state.isAuthenticated) {
        if (!isChosen() && !isOverViewPage) {
            navigator("/container").then();
            return <AppFullScreenLoader />;
        }
        return (
            <AppProvider>
                <AppConfiguration>
                    <DashboardLayout>
                        <Router primary={false}>
                            <LandingHelper path="/" />
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
                    <AppWelcomeModal
                        show={showWelcomeModal}
                        handleClose={() => {
                            setShowWelcomeModal(false);
                        }}
                    />
                    <AppPictureInPicture show={true}>
                        <AppYoutubeFrame
                            url={
                                "https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=253s"
                            }
                            height={"200"}
                            width={"100%"}
                        />
                    </AppPictureInPicture>
                </AppConfiguration>
            </AppProvider>
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
