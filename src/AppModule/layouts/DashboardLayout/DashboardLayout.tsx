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

export const DashboardLayout: FC = ({ children }) => {
    const {
        hideNav,
        hideMessenger,
        navPosition,
    } = useRecoilValue<AppDashboardLayoutOptions>(appDashboardLayoutOptions);

    const isA3d = window.location !== window.parent.location;
    const onBoarding = window.location.pathname;
    const { isChosen } = useChosenContainer();

    const renderClass = () => {
        if (hideNav || isA3d) return "";
        if (navPosition === "bottom") return " bottom-nav ";
        return "right-container";
    };
    return (
        <Container className={"p-0 unfixed"} fluid={true}>
            {hideNav || isA3d ? null : <AppNavigation items={appNavigations} />}
            <div
                className={`app-container ${renderClass()} mr-0 ml-auto ${
                    onBoarding === "/onboarding" ? " with-bg mb-0" : " mb-5"
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
