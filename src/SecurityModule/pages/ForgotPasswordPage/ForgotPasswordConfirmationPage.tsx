import React, { FC } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Container, Row } from "react-bootstrap";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import "./assets/scss/styles.scss";

export const ForgotPasswordConfirmationPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <Container fluid className="active-account auth-container with-bg">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title={t("forgotPasswordConfirmation:title")}
                        description={t(
                            "forgotPasswordConfirmation:description"
                        )}
                    />
                    <span className="text-center w-100 p-3">
                        {t("forgotPasswordConfirmation:message")}
                        <br />
                        <Link
                            to="/auth/forgot-password"
                            className="btn btn-secondary tryagain-forgot-btn mt-3 mx-auto"
                        >
                            <b>
                                {t("forgotPasswordConfirmation:label.tryAgain")}
                            </b>
                        </Link>
                    </span>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
