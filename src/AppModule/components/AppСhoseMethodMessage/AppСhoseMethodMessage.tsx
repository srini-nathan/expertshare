import React, { FC } from "react";
import { AppTab } from "../AppTab";
import { AppTabs } from "../AppTabs";
import { AppMessageCompose } from "../AppMessageCompose";

import "./assests/scss/style.scss";

export interface AppСhoseMethodMessageProps {
    activeTab: string;
    className?: string;
    rows: number;
    enterToPost?: boolean;
}

export const AppСhoseMethodMessage: FC<AppСhoseMethodMessageProps> = ({
    activeTab,
    rows,
    enterToPost,
    ...props
}): JSX.Element => {
    const [activeTabMessage, setActiveTabMessage] = React.useState<string>(
        activeTab
    );

    return (
        <div {...props}>
            <AppTabs
                onSelect={setActiveTabMessage}
                activeKey={activeTabMessage}
            >
                <AppTab
                    eventKey="Text"
                    title={
                        <span>
                            <i className="far fa-align-left"></i> Text
                        </span>
                    }
                >
                    <AppMessageCompose
                        id="textarea"
                        label="Text Area"
                        placeholder="Write your message..."
                        rows={rows}
                        isSend
                        enterToPost={enterToPost}
                        className="main-messages"
                    />
                </AppTab>
                <AppTab
                    eventKey="Audio"
                    title={
                        <span>
                            <i className="fal fa-microphone"></i> Audio
                        </span>
                    }
                >
                    Audio
                </AppTab>
                <AppTab
                    eventKey="Video"
                    title={
                        <span>
                            <i className="fal fa-video"></i> Video
                        </span>
                    }
                >
                    Video
                </AppTab>
            </AppTabs>
        </div>
    );
};
