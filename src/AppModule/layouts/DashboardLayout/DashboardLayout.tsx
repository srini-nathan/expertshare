import React, { FC } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { appNavigations } from "../../bootstrap";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";

export const DashboardLayout: FC = ({ children }) => {
    return (
        <Container className={"p-0"} fluid={true}>
            <Row className={"m-0"}>
                <Col sm={12} md={3} xl={2} className={"p-0"}>
                    <AppNavigation items={appNavigations} />
                </Col>
                <Col md={9} xl={10} className={"p-5"}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
};
