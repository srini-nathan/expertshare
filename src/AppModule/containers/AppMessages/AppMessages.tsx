import React, { FC } from "react";
import { AppChatOneToOne } from "../AppChatOneToOne";
import { AppMessageInbox } from "../AppMessageInbox";

export interface AppMessagesProps {
    disable?: boolean;
}

export const AppMessages: FC<AppMessagesProps> = ({ disable }) => {
    if (disable) {
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
