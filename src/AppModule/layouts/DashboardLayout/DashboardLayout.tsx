import React, { FC } from "react";
import { Container } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";
import { appNavigations } from "../../bootstrap";
import {
    AppDashboardLayoutOptions,
    appDashboardLayoutOptions,
} from "../../atoms";
// import { AppMessages } from "../../containers/AppMessages";

export const DashboardLayout: FC = ({ children }) => {
    const {
        hideNav,
        // hideMessenger,
    } = useRecoilValue<AppDashboardLayoutOptions>(appDashboardLayoutOptions);

    const isA3d = window.location !== window.parent.location;
    const onBoarding = window.location.pathname;

    return (
        <Container className={"p-0 unfixed"} fluid={true}>
            {hideNav || isA3d ? null : <AppNavigation items={appNavigations} />}
            <div
                className={`app-container ${
                    hideNav || isA3d ? " " : "right-container"
                } mr-0 ml-auto ${
                    onBoarding === "/onboarding" ? " with-bg mb-0" : " mb-5"
                }`}
            >
                <div className="col-md-12 col-sm-12 col-xl-12 p-3 p-lg-4">
                    {children}
                </div>
                {/* <AppMessages disable={hideMessenger} /> */}
            </div>
        </Container>
    );
};
