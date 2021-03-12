import React, { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { appNavigations } from "../../bootstrap";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";

export const DashboardLayout: FC = ({ children }) => {
    return (
        <Container className={"p-0"} fluid={true}>
            <Row noGutters={true}>
                <Col md={3} xl={2}>
                    <AppNavigation items={appNavigations} />
                </Col>
                <Col md={9} xl={10}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
};
