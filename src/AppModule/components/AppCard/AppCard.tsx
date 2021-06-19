import React, { FC } from "react";
import { Card } from "react-bootstrap";

import "./assets/scss/style.scss";

export interface AppCardProps {
    children: JSX.Element[] | JSX.Element;
    title?: string;
    subtitle?: string;
    className?: string;
}

export const AppCard: FC<AppCardProps> = ({
    children,
    title,
    subtitle,
    className = "mt-2 p-4",
}): JSX.Element => {
    return (
        <Card className={`col-12 mb-3 mb-lg-4 ${className}`}>
            {title && title?.length > 0 && (
                <Card.Title className="mb-2">{title}</Card.Title>
            )}
            {subtitle && subtitle?.length > 0 && (
                <Card.Subtitle className="mb-2 text-muted">
                    {subtitle}
                </Card.Subtitle>
            )}
            <Card.Body className="p-0">{children}</Card.Body>
        </Card>
    );
};
