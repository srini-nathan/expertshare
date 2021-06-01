import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import "./assets/scss/style.scss";
import { AppListPageToolbar } from "../AppListPageToolbar";
import { AppHeaderTypeSwitch } from "../AppHeaderTypeSwitch";

export interface AppPageHeaderProps {
    title: string;
    createLink?: string;
    showToolbar?: boolean;
    customToolbar?: boolean;
    showViewLayoutButtons?: boolean;
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
    showViewLayoutButtons = false,
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
                <Col md={6}>
                    <AppListPageToolbar
                        createLabel={createLabel}
                        createLink={createLink}
                        onQuickFilterChange={onQuickFilterChange}
                        cancelTokenSources={cancelTokenSources}
                    />
                </Col>
            )}
            {customToolbar && <Col md={6}>{children}</Col>}
            <Col md={1}>
                {showViewLayoutButtons && (
                    <AppHeaderTypeSwitch></AppHeaderTypeSwitch>
                )}
            </Col>
        </Row>
    );
};
