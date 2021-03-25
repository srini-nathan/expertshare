import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppPageHeaderProps {
    title: string;
}

export const AppPageHeader: FC<AppPageHeaderProps> = ({
    title,
}): JSX.Element => {
    return (
        <Row>
            <Col>
                <h1 className="page-title">{title}</h1>
            </Col>
        </Row>
    );
};
