import React, { FC } from "react";
import { AppChatOneToOne } from "../AppChatOneToOne";
import { AppMessageInbox } from "../AppMessageInbox";
import { useCheckFeature } from "../../hooks/useCheckFeature";

export interface AppMessagesProps {
    disable?: boolean;
}

export const AppMessages: FC<AppMessagesProps> = ({ disable }) => {
    const { isChatEnable } = useCheckFeature();

    if (disable) {
        return null;
    }

    if (!isChatEnable()) {
        return null;
    }

    return (
        <div className="app-message-inbox">
            <div className="app-message-inbox--container">
                <AppChatOneToOne />
                <AppMessageInbox />
            </div>
        </div>
    );
};
