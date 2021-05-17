import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import "./assets/scss/style.scss";
import { AppListPageToolbar } from "../AppListPageToolbar";

export interface AppPageHeaderProps {
    title: string;
    createLink?: string;
    showToolbar?: boolean;
    createLabel?: string;
    onQuickFilterChange?: (s: string) => void;
    cancelTokenSources?: Canceler[];
}

export const AppPageHeader: FC<AppPageHeaderProps> = ({
    title,
    createLink,
    createLabel = "Create",
    showToolbar = false,
    onQuickFilterChange,
    cancelTokenSources,
}): JSX.Element => {
    return (
        <Row>
            <Col md={6} className="page-title">
                <h1>{title}</h1>
            </Col>
            {showToolbar && (
                <Col md={6}>
                    <AppListPageToolbar
                        createLabel={createLabel}
                        createLink={createLink}
                        onQuickFilterChange={onQuickFilterChange}
                        cancelTokenSources={cancelTokenSources}
                    />
                </Col>
            )}
        </Row>
    );
};
