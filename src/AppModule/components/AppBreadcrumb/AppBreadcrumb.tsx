import React, { FC } from "react";
import { Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";

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
                    <AppIcon name={"ChevronLeft"} />
                    <Link to={linkUrl} className="ml-2">
                        {linkText}
                    </Link>
                </nav>
            </Col>
        </Row>
    );
};
