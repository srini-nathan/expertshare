import React, { FunctionComponent } from "react";
import { Tab } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppTabProps {
    eventKey?: string;
    title: React.ReactNode;
}
export const AppTab: FunctionComponent<AppTabProps> = ({
    eventKey,
    title,
    ...props
}) => {
    return (
        <Tab eventKey={eventKey} title={title}>
            {props.children}
        </Tab>
    );
};
