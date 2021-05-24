import React, { FC } from "react";
import { AppTabs, AppTab } from "../../components";

import "./assets/scss/style.scss";

export interface PTOPMessagestProps {
    activeTab: string;
}

export const PTOPMessages: FC<PTOPMessagestProps> = ({
    activeTab,
}): JSX.Element => {
    const [activeTabMessage, setActiveTabMessage] = React.useState<string>(
        activeTab
    );

    return (
        <AppTabs onSelect={setActiveTabMessage} activeKey={activeTabMessage}>
            <AppTab eventKey="Text" title="Text"></AppTab>
            <AppTab eventKey="Audio" title="Audio">
                Audio module
            </AppTab>
            <AppTab eventKey="Video" title="Video">
                Video Module
            </AppTab>
        </AppTabs>
    );
};
