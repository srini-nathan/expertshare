import React, { FC } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import "./assets/scss/styles.scss";

export const ResetPasswordConfirmationPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Container fluid className="active-account auth-container with-bg">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title={t("resetPasswordConfirmation:title")}
                        description={t("resetPasswordConfirmation:description")}
                    />
                    <Col className="text-center p-3">
                        <Link to="/auth/login">
                            <b>
                                {" "}
                                {t(
                                    "resetPasswordConfirmation.form:label.login"
                                )}
                            </b>
                        </Link>
                    </Col>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
