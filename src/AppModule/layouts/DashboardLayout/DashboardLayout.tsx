import React, { FC } from "react";
import { Container } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { appNavigations } from "../../bootstrap";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";
import { AppMessageBox } from "../../containers/AppMessageBox/AppMessageBox";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
} from "../../atoms";

export const DashboardLayout: FC = ({ children }) => {
    const {
        hideNav,
        hideMessenger,
    } = useRecoilValue<AppDashboardLayoutOptions>(appDashboardLayoutOptions);

    return (
        <Container className={"p-0 unfixed"} fluid={true}>
            {hideNav ? null : <AppNavigation items={appNavigations} />}
            <div
                className={`app-container ${
                    hideNav ? " " : "right-container"
                } mr-0 ml-auto mb-5`}
            >
                <div className="col-md-12 col-sm-12 col-xl-12 p-3 p-lg-4 mb-2">
                    {children}
                </div>
                {hideMessenger ? null : <AppMessageBox userChatID={() => {}} />}
            </div>
        </Container>
    );
};
