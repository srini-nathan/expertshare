import React, { FC } from "react";
import { Container } from "react-bootstrap";
import { appNavigations } from "../../bootstrap";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";

export const DashboardLayout: FC = ({ children }) => {
    return (
        <Container className={"p-0 unfixed"} fluid={true}>
            <AppNavigation items={appNavigations} />
            <div className="app-container right-container mr-0 ml-auto mb-5">
                <div className="col-md-12 col-sm-12 col-xl-12 p-3 p-lg-4 mb-2">
                    {children}
                </div>
            </div>
        </Container>
    );
};
