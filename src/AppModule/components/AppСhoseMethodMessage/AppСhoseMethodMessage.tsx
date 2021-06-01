import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { AppTab } from "../AppTab";
import { AppTabs } from "../AppTabs";
import { AppFormTextArea } from "../AppFormTextArea";

import "./assests/scss/style.scss";

export interface AppСhoseMethodMessageProps {
    activeTab: string;
    className?: string;
}

export const AppСhoseMethodMessage: FC<AppСhoseMethodMessageProps> = ({
    activeTab,
    ...props
}): JSX.Element => {
    const { control } = useForm();

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
                    <AppFormTextArea
                        id="textarea"
                        md="12"
                        sm="12"
                        lg="12"
                        xl="12"
                        name="textarea"
                        label="Text Area"
                        placeholder="Write your message..."
                        maxCount={150}
                        rows={1}
                        control={control}
                        isSend
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
