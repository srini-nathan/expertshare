import React, { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { appNavigations } from "../../bootstrap";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";

export const DashboardLayout: FC = ({ children }) => {
    return (
        <Container className={"p-0"} fluid={true}>
            <Row noGutters={true}>
                <Col md={4}>
                    <AppNavigation items={appNavigations} />
                </Col>
                <Col md={8}>{children}</Col>
            </Row>
        </Container>
    );
};
