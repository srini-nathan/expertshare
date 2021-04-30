import React, { FC } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Container, Row } from "react-bootstrap";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import "./assets/scss/styles.scss";

export const ForgotPasswordConfirmationPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Container fluid className="active-account auth-container">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title="Confirmation"
                        desctiption="An email has been sent that contains a link that you can click to reset your password. This link will expire in 2 hour(s)."
                    />
                    <span className="text-center p-3">
                        If you don't receive an email please check your spam
                        folder or
                        <br />
                        <Link to="/auth/forgot-password">
                            <b> try again </b>
                        </Link>
                        .
                    </span>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
