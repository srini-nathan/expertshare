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
    isEdit?: boolean;
    editMessage?: any;
    handleMessageSend?: (message: string) => void;
    handleUpdateMessage?: (message: string) => void;
}

export const AppСhoseMethodMessage: FC<AppСhoseMethodMessageProps> = ({
    activeTab,
    rows,
    enterToPost,
    handleMessageSend,
    handleUpdateMessage,
    editMessage,
    isEdit,
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
                        editMessage={editMessage}
                        isEdit={isEdit}
                        enterToPost={enterToPost}
                        className="main-messages"
                        handleUpdateData={(message) => {
                            if (handleUpdateMessage) {
                                handleUpdateMessage(message);
                            }
                        }}
                        handleDataSend={(data) => {
                            if (handleMessageSend) {
                                handleMessageSend(data);
                            }
                        }}
                    />
                </AppTab>
                {/* <AppTab
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
                </AppTab> */}
            </AppTabs>
        </div>
    );
};
