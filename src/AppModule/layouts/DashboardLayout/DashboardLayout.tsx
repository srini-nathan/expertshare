import React, { FC } from "react";
import { Container } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";
import { appNavigations } from "../../bootstrap";
import {
    AppDashboardLayoutOptions,
    appDashboardLayoutOptions,
} from "../../atoms";
import { AppMessages } from "../../containers/AppMessages";
import { useChosenContainer } from "../../hooks";
import { AppCallOneToOne } from "../../containers/AppCallOneToOne";
import { useGlobalData } from "../../contexts";

export const DashboardLayout: FC = ({ children }) => {
    const {
        hideNav,
        hideMessenger,
        navPosition,
    } = useRecoilValue<AppDashboardLayoutOptions>(appDashboardLayoutOptions);

    const isA3d = window.location !== window.parent.location;
    const onBoarding = window.location.pathname;
    const { isChosen } = useChosenContainer();
    const { container } = useGlobalData();

    const renderClass = () => {
        let classes = "";
        if (onBoarding === "/onboarding") {
            classes = "mb-0";
            classes +=
                container?.domain === "csgsc.virtual.credit-suisse.com"
                    ? " with-csgsc-bg"
                    : " with-bg";
        } else {
            classes = "mb-5";
        }
        if (hideNav || isA3d) {
            return classes;
        }
        if (navPosition === "bottom") {
            classes += " bottom-nav";
            return classes;
        }
        classes += " right-container";

        return classes;
    };
    return (
        <Container className={"p-0 unfixed"} fluid={true}>
            {hideNav || isA3d ? null : <AppNavigation items={appNavigations} />}
            <div
                className={`app-container ${renderClass()} mr-0 ml-auto ${
                    onBoarding === "/onboarding" ? `with-bg mb-0` : " mb-5"
                }`}
            >
                <div className="col-md-12 col-sm-12 col-xl-12 p-3 p-lg-4">
                    {children}
                </div>
                {isChosen() && !isA3d && (
                    <AppMessages disable={hideMessenger} />
                )}
                <AppCallOneToOne />
            </div>
        </Container>
    );
};
