import React, { FC } from "react";
import { Col } from "react-bootstrap";
import "./assets/scss/styles.scss";

export interface AppAuthHeaderProps {
    title: string;
    description?: string;
    errorMessage?: string;
}

export const AppAuthHeader: FC<AppAuthHeaderProps> = ({
    title,
    description = "",
    errorMessage = "",
}) => {
    return (
        <>
            <Col
                md={12}
                className="active-account-box--logo-box text-center my-3"
            >
                <a href="/">
                    <i></i>
                </a>
            </Col>
            <div className="col-md-12 active-account-box--text-box">
                <h2 className="mt-4 text-center">{title}</h2>
                <p className="mt-2 mb-3 text-center">{description}</p>

                <div className="my-2 text-center">
                    <b className="error-message">{errorMessage}</b>
                </div>
            </div>
        </>
    );
};
