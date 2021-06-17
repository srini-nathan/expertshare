import React, { FC, useState, useEffect } from "react";
import { find } from "lodash";
import {
    AppLoader,
    AppChatOneToOneHeader,
    AppChatOneToOneComposer,
    AppChatOneToOneMessage,
} from "../../components";
import { ChatMessage } from "../../models/entities/ChatMessage";
import {
    useAuthState,
    useInitChatOneToOne,
    useOpenChatOneToOne,
} from "../../hooks";
import { PUser } from "../../../AdminModule/models";

import "./assets/scss/style.scss";

export const AppChatOneToOne: FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { getMessages } = useInitChatOneToOne();
    const { user: loginUser } = useAuthState();
    const { openThread } = useOpenChatOneToOne();
    const [closed, setClosed] = useState(openThread === null);

    useEffect(() => {
        if (openThread !== null) {
            setLoading(true);
            getMessages(1)
                .then(({ response }) => {
                    if (response && response.items) {
                        setMessages(response.items);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        setClosed(openThread === null);
    }, [openThread]);

    if (closed === true) {
        return null;
    }

    const user = find(
        openThread?.users,
        (u: PUser) => loginUser.id !== u.id
    ) as PUser;

    return (
        <div className={`app-chat-one-to-one ${collapsed ? "collapsed" : ""}`}>
            <div className="inner-container">
                <AppChatOneToOneHeader
                    onCollapseAction={() => {
                        setCollapsed(!collapsed);
                    }}
                    onCloseAction={() => {
                        setClosed(true);
                    }}
                    user={user}
                />
                <div className="row m-0 px-0 pt-1 pb-3">
                    <div className="chat-list col-auto p-0 w-100">
                        <div className="chat-list--container p-3 ">
                            {loading ? (
                                <AppLoader />
                            ) : (
                                messages.map((t: ChatMessage) => (
                                    <AppChatOneToOneMessage
                                        key={t.id}
                                        chat={t}
                                        loginUser={loginUser}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <AppChatOneToOneComposer
                    onSendAction={() => {}}
                    onTypingAction={() => {}}
                />
            </div>
        </div>
    );
};
