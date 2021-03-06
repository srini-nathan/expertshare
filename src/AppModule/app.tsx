import React, { useEffect } from "react";
import { Redirect, Router, Location, useMatch } from "@reach/router";
import { useTranslation } from "react-i18next";
import { appRouters } from "./bootstrap";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppConfiguration } from "./layouts/AppConfiguration";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter, PrimitiveObject } from "./models";
import AppProvider from "./contexts/AppContext";
import SessionProvider from "./contexts/SessionContext";
import { AuthContext } from "../SecurityModule/contexts/AuthContext";
import { init } from "./config/date-fns";
import {
    useChosenContainer,
    useCommandCenterSocketEvents,
    useNavigator,
    useSkipOnBoarding,
    useUserSocketEvents,
} from "./hooks";
import { AppLoader, AppPictureInPicture, AppWelcomeModal } from "./components";
import { LandingHelper } from "./pages";
import { socket, EVENTS, CommandType } from "./socket";

import { useGlobalData } from "./contexts";
import "./assets/scss/bootstrap.scss";
import "./assets/scss/main.scss";
import { AuthState } from "../SecurityModule/models";
import { isAppLoadedInIFrame, parseConfiguration } from "./utils";
import { PUser } from "../AdminModule/models";
import "swiper/swiper-bundle.css";

const { CONNECT, DISCONNECT } = EVENTS;
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
    const { status, container } = useGlobalData();
    const { state } = React.useContext(AuthContext);
    const { isAuthenticated, user } = state as AuthState;
    const navigator = useNavigator();
    const { isChosen } = useChosenContainer();
    const { isSkipOnBoarding } = useSkipOnBoarding();
    const [showWelcomeModal, setShowWelcomeModal] = React.useState(true);
    const dashboardRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "dashboard"
    );
    const authRoutes: ModuleRouter[] = appRouters.filter(
        ({ layout }) => layout === "auth"
    );
    const overViewPage = useMatch("/container");
    const onBoardingPage = useMatch("/onboarding");
    const autoLoginPage = useMatch("/auth/auto-login/:token");
    const autoLoginPageFromContainer = useMatch(
        "/auth/auto-login/:token/:skip"
    );
    const sessionDetailPage = useMatch("/event/:conferenceId/session/:id");
    const reloadingPage = useMatch("/reloading");
    const isOverViewPage = overViewPage !== null;
    const isAutoLoginPage = !(
        autoLoginPage === null && autoLoginPageFromContainer === null
    );
    const showPipPlayer = sessionDetailPage === null && reloadingPage === null;
    const { emitLogin, emitLogout, emitPageChange } = useUserSocketEvents();
    const { handler } = useCommandCenterSocketEvents();
    const skippedOnBoarding = isSkipOnBoarding();
    const { t } = useTranslation();
    const config = parseConfiguration(container);

    init(t);

    useEffect(() => {
        // remove data set when the session page is opened in 3D view
        localStorage.removeItem("isSessionDetailsViewVisible");
        if (isAppLoadedInIFrame()) {
            document.body.classList.add("app-in-iframe");
        }
    }, []);

    useEffect(() => {
        socket.on(CONNECT, () => {
            if (isAuthenticated === true) {
                emitLogin();
            }

            if (isAuthenticated === false) {
                emitLogout();
            }
        });

        if (isAuthenticated === true) {
            emitLogin();
        }

        if (isAuthenticated === false) {
            emitLogout();
        }

        socket.on(DISCONNECT, () => {
            emitLogout();
        });

        socket.on("online", () => {});

        socket.on(
            EVENTS.ON_NEW_COMMAND,
            (
                from: PUser,
                to: PUser,
                type: CommandType,
                payload: PrimitiveObject
            ) => {
                handler(from, to, type, payload);
            }
        );

        return () => {
            socket.off(CONNECT);
            socket.off("online");
            socket.off(DISCONNECT);
            socket.off(EVENTS.ON_NEW_COMMAND);
        };
    }, [container, isAuthenticated]);

    if (status === "LOADING" || isAuthenticated === null) {
        return <AppFullScreenLoader />;
    }
    if (!isAutoLoginPage && isAuthenticated === true && user && container) {
        if (
            config.isOnboardingEnable &&
            !user.isOnboarded &&
            !onBoardingPage &&
            !skippedOnBoarding
        ) {
            navigator("/onboarding").then();
        } else if (!isChosen() && !isOverViewPage && !onBoardingPage) {
            navigator("/container").then();
            return <AppFullScreenLoader />;
        }
        return (
            <AppProvider>
                <SessionProvider>
                    <AppConfiguration>
                        <DashboardLayout>
                            <Router primary={false}>
                                <LandingHelper path="/" />
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
                                    emitPageChange();
                                }}
                            />
                        </DashboardLayout>
                        {isChosen() && (
                            <AppWelcomeModal
                                show={showWelcomeModal}
                                handleClose={() => {
                                    setShowWelcomeModal(false);
                                }}
                            />
                        )}
                        {showPipPlayer ? <AppPictureInPicture /> : null}
                    </AppConfiguration>
                </SessionProvider>
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
            <OnRouteChange
                action={() => {
                    window.scrollTo(0, 0);
                    emitPageChange();
                }}
            />
        </AuthLayout>
    );
};

export default App;
