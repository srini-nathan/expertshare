import React, { FC } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Container, Row, Col } from "react-bootstrap";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import "./assets/scss/styles.scss";

export const ResetPasswordPageConfirmation: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Container fluid className="active-account auth-container">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title="Confirmation"
                        desctiption="Your password has been changed. You can login with your Email address and your new Password."
                    />
                    <Col className="text-center p-3">
                        <Link to="/auth/login">
                            <b>Login</b>
                        </Link>
                    </Col>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
