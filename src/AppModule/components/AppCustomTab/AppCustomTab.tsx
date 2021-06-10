import React, { FunctionComponent } from "react";
import { Nav } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppCustomTabProps {
    eventKey?: string;
    children: JSX.Element[] | JSX.Element;
    className?: string;
}
export const AppCustomTab: FunctionComponent<AppCustomTabProps> = ({
    children,
    eventKey,
    className = "",
}) => {
    return (
        <Nav className={`flex-column streaming-tab ${className}`}>
            <Nav.Item>
                <Nav.Link eventKey={eventKey} className="btn btn-secondary">
                    {children}
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};
