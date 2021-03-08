import React, { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { navigations } from "../../bootstrap";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";

export const DashboardLayout: FC = () => {
    return (
        <Container className={"p-0"} fluid={true}>
            <Row noGutters={true}>
                <Col md={4}>
                    <AppNavigation items={navigations} />
                </Col>
            </Row>
        </Container>
    );
};
