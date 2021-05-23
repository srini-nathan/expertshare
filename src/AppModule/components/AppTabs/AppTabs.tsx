import React, { FunctionComponent } from "react";
import { Tabs } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppTabsProps {
    activeKey?: string;
    defaultKeyValue?: string;
    onSelect?: any;
}
export const AppTabs: FunctionComponent<AppTabsProps> = ({
    activeKey,
    defaultKeyValue,
    onSelect = () => {},
    ...props
}) => {
    return (
        <Tabs
            onSelect={onSelect}
            activeKey={activeKey}
            defaultKeyValue={defaultKeyValue}
        >
            {props.children}
        </Tabs>
    );
};
