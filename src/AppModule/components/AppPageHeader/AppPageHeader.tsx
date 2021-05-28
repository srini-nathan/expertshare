import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import "./assets/scss/style.scss";
import { AppListPageToolbar } from "../AppListPageToolbar";

export interface AppPageHeaderProps {
    title: string;
    createLink?: string;
    showToolbar?: boolean;
    customToolbar?: boolean;
    createLabel?: string;
    onQuickFilterChange?: (s: string) => void;
    cancelTokenSources?: Canceler[];
}

export const AppPageHeader: FC<AppPageHeaderProps> = ({
    title,
    createLink,
    createLabel = "Create",
    showToolbar = false,
    customToolbar = false,
    onQuickFilterChange,
    cancelTokenSources,
    children,
}): JSX.Element => {
    return (
        <Row className="pt-sm-3">
            <Col md={12} sm={12} lg={12} xl={4} className="page-title">
                <h1>{title}</h1>
            </Col>
            {showToolbar && (
                <Col
                    className="mb-sm-3 mb-lg-3 mb-xl-0 mt-xl-3"
                    sm={12}
                    md={12}
                    lg={12}
                    xl={8}
                >
                    <AppListPageToolbar
                        createLabel={createLabel}
                        createLink={createLink}
                        onQuickFilterChange={onQuickFilterChange}
                        cancelTokenSources={cancelTokenSources}
                    />
                </Col>
            )}
            {customToolbar && (
                <Col sm={12} md={12} lg={12} xl={8}>
                    {children}
                </Col>
            )}
        </Row>
    );
};
