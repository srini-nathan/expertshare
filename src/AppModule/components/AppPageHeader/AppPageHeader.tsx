import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { AppListPageToolbar } from "../AppListPageToolbar";
import "./assets/scss/style.scss";

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
        mdSize = 12;
    } else if (showToolbar === false) {
        mdSize = 12;
    }
    return (
        <Row className="pt-sm-3">
            <Col xs={12} md={mdSize} lg={"auto"} className="page-title">
                <h1>{title}</h1>
            </Col>
            {showToolbar && (
                <Col md={6} className="d-flex justify-content-end mr-0 ml-auto">
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
                    className="d-flex justify-content-start justify-content-sm-end mr-0 ml-auto"
                    xs={12}
                    md={12}
                    lg={"auto"}
                >
                    {children}
                </Col>
            )}
        </Row>
    );
};

export const AppPageHeaderTranslatable: FC<AppPageHeaderProps> = ({
    title = "",
    ...rest
}): JSX.Element => {
    const { t } = useTranslation();
    return <AppPageHeader {...rest} title={t(title)}></AppPageHeader>;
};
