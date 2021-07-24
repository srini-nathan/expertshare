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
    let mdSize = 6;
    if (customToolbar) {
        mdSize = 3;
    } else if (showToolbar === false) {
        mdSize = 12;
    }
    return (
        <Row className="pt-sm-3">
            <Col md={mdSize} xs={12} className="page-title">
                <h1>{title}</h1>
            </Col>
            {showToolbar && (
                <Col md={6} className="d-flex justify-content-end">
                    <AppListPageToolbar
                        createLabel={createLabel}
                        createLink={createLink}
                        onQuickFilterChange={onQuickFilterChange}
                        cancelTokenSources={cancelTokenSources}
                    />
                </Col>
            )}
            {customToolbar && (
                <Col
                    className="d-flex justify-content-start justify-content-sm-end"
                    md={9}
                    xs={12}
                >
                    {children}
                </Col>
            )}
        </Row>
    );
};
