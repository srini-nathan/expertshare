import React, { useEffect } from "react";
import { Redirect, Router, Location, useMatch } from "@reach/router";
import { appRouters } from "./bootstrap";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppConfiguration } from "./layouts/AppConfiguration";
import { AuthLayout } from "./layouts/AuthLayout";
import { ModuleRouter } from "./models";
import AppProvider from "./contexts/AppContext";
import { AuthContext } from "../SecurityModule/contexts/AuthContext";
import { useChosenContainer, useNavigator, useSkipOnboarding } from "./hooks";
import {
    AppLoader,
    AppPictureInPicture,
    AppYoutubeFrame,
    AppWelcomeModal,
} from "./components";
import { LandingHelper } from "./pages";
import { socket, EVENTS, onPageChange } from "./socket";
import { useGlobalData } from "./contexts";
import { successToast } from "./utils";
import { UserApi, ContainerApi } from "../AdminModule/apis";

import "./assets/scss/bootstrap.scss";
import "./assets/scss/main.scss";
import { AuthState } from "../SecurityModule/models";

const { CONNECT, DISCONNECT, USER_LOGIN, USER_LOGOUT } = EVENTS;
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
    const { isAuthenticated, user, token } = state as AuthState;
    const navigator = useNavigator();
    const { isChosen } = useChosenContainer();
    const { isSkipOnboarding } = useSkipOnboarding();
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
    const isOverViewPage = overViewPage !== null;
    const isAutoLoginPage = autoLoginPage !== null;

    useEffect(() => {
        socket.on(CONNECT, () => {
            if (isAuthenticated === true && user) {
                socket.emit(USER_LOGIN, {
                    token,
                    userId: user.id,
                });
            }

            if (isAuthenticated === false) {
                socket.emit(USER_LOGOUT, {
                    token: null,
                    userId: null,
                });
            }
        });

        if (isAuthenticated === true && user) {
            socket.emit(USER_LOGIN, {
                token,
                userId: user.id,
            });
        }

        if (isAuthenticated === false) {
            socket.emit(USER_LOGOUT, {
                token: null,
                userId: null,
            });
        }

        socket.on(DISCONNECT, () => {
            socket.emit(USER_LOGOUT, {
                token: null,
                userId: null,
            });
        });

        socket.on("online", ({ userId }) => {
            successToast(`User online ${userId}`);
        });
        return () => {
            socket.off(CONNECT);
            socket.off("online");
            socket.off(DISCONNECT);
        };
    }, [container, isAuthenticated]);

    if (status === "LOADING" || isAuthenticated === null) {
        return <AppFullScreenLoader />;
    }

    if (!isAutoLoginPage && isAuthenticated === true && user && container) {
        const { id: uId } = user;
        const { id: cId } = container;
        if (!user.isOnboarded && !isSkipOnboarding() && !onBoardingPage) {
            navigator("/onboarding").then();
        } else if (!isChosen() && !isOverViewPage && !onBoardingPage) {
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
                                if (uId) {
                                    onPageChange({
                                        url: window.location.href,
                                        pageTitle: document.title,
                                        user: UserApi.toResourceUrl(uId),
                                        container: ContainerApi.toResourceUrl(
                                            cId
                                        ),
                                    });
                                }
                            }}
                        />
                    </DashboardLayout>
                    <AppWelcomeModal
                        show={showWelcomeModal}
                        handleClose={() => {
                            setShowWelcomeModal(false);
                        }}
                    />
                    <AppPictureInPicture show={false}>
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
            <OnRouteChange
                action={() => {
                    window.scrollTo(0, 0);
                    if (container) {
                        onPageChange({
                            url: window.location.href,
                            pageTitle: document.title,
                            container: ContainerApi.toResourceUrl(container.id),
                        });
                    }
                }}
            />
        </AuthLayout>
    );
};

export default App;
