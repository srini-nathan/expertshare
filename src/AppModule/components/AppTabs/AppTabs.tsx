import React, { FunctionComponent } from "react";
import { Tabs } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppTabsProps {
    activeKey?: string;
    defaultKeyValue?: string;
    className?: string;
    onSelect?: any;
}
export const AppTabs: FunctionComponent<AppTabsProps> = ({
    activeKey,
    defaultKeyValue,
    className = "",
    onSelect = () => {},
    ...props
}) => {
    return (
        <Tabs
            className={className}
            onSelect={onSelect}
            activeKey={activeKey}
            defaultKeyValue={defaultKeyValue}
        >
            {props.children}
        </Tabs>
    );
};
