import React, { FunctionComponent } from "react";
import "./assets/scss/style.scss";

export interface AppChatListsProps {
    data?: [];
}
export const AppChatList: FunctionComponent<AppChatListsProps> = () => {
    const devider = () => {
        return (
            <div className="divider-time pb-3">
                <span>12 April, 2021</span>
            </div>
        );
    };

    const messageItem = () => {
        return (
            <div className="message-item in">
                <div className="avatar">
                    <i></i>
                </div>
                <div className="content">
                    <div className="content--header">
                        <h4>
                            Jane Cooper
                            <span className="time">10:00 PM</span>
                        </h4>
                    </div>
                    <div className="content--comment">
                        <p className="p-2">
                            Hello guy👋 Lemme invite you all to my
                            session!!!!🔥👍
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="chat-list-container p-3">
            {devider()}
            {messageItem()}
        </div>
    );
};
