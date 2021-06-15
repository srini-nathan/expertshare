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
    createLabel = "common.button:create",
    showToolbar = false,
    customToolbar = false,
    onQuickFilterChange,
    cancelTokenSources,
    children,
}): JSX.Element => {
    return (
        <Row className="pt-sm-3">
            <Col md={5} className="page-title">
                <h1>{title}</h1>
            </Col>
            {showToolbar && (
                <Col md={7}>
                    <AppListPageToolbar
                        createLabel={createLabel}
                        createLink={createLink}
                        onQuickFilterChange={onQuickFilterChange}
                        cancelTokenSources={cancelTokenSources}
                    />
                </Col>
            )}
            {customToolbar && (
                <Col className="d-flex justify-content-end" md={7}>
                    {children}
                </Col>
            )}
        </Row>
    );
};
