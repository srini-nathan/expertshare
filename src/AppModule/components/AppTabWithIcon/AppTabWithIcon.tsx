import React, { FunctionComponent } from "react";
import { Nav } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppTabWithIconProps {
    eventKey?: string;
    className?: string;
    title: string;
    icon: string;
}
export const AppTabWithIcon: FunctionComponent<AppTabWithIconProps> = ({
    eventKey,
    title,
    icon,
    className = "",
}) => {
    return (
        <Nav variant="pills" className={`flex-column ${className}`}>
            <Nav.Item>
                <Nav.Link eventKey={eventKey}>
                    <i className={icon} aria-hidden="true"></i>
                    {title}
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};
