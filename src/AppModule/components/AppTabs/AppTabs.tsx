import React, { FunctionComponent } from "react";
import { Tabs } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppTabsProps {
    activeKey?: string;
    onSelect?: any;
}
export const AppTabs: FunctionComponent<AppTabsProps> = ({
    activeKey,
    onSelect = () => {},
    ...props
}) => {
    return (
        <Tabs onSelect={onSelect} activeKey={activeKey} displayName="df">
            {props.children}
        </Tabs>
    );
};
