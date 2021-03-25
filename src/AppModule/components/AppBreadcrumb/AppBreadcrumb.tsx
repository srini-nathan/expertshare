import React, { FC } from "react";
import { Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import "./assets/scss/style.scss";
import { AppIcon } from "../AppIcon";

export interface AppBreadcrumbProps {
    linkUrl: string;
    linkText: string;
}

export const AppBreadcrumb: FC<AppBreadcrumbProps> = ({
    linkText,
    linkUrl,
}): JSX.Element => {
    return (
        <Row>
            <Col>
                <nav className={"es-breadcrumb d-flex align-items-center"}>
                    <AppIcon name={"back"} />
                    <Link to={linkUrl} className="theme-breadcrumbs-clr ml-2">
                        {linkText}
                    </Link>
                </nav>
            </Col>
        </Row>
    );
};
