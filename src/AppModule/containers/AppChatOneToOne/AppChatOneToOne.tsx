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
    useChatSocketEvents,
} from "../../hooks";
import { PUser } from "../../../AdminModule/models";
import { socket, EVENTS } from "../../socket";
import { ChatThreadApi } from "../../apis";
import { UserApi } from "../../../AdminModule/apis";

import "./assets/scss/style.scss";

export const AppChatOneToOne: FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { getMessages } = useInitChatOneToOne();
    const { user: loginUser } = useAuthState();
    const { openThread } = useOpenChatOneToOne();
    const [closed, setClosed] = useState(openThread === null);
    const {
        emitJoinChatThread,
        emitLeaveChatThread,
        emitChatMessage,
        emitTyping,
    } = useChatSocketEvents();
    const [otherUser, setOtherUser] = useState<PUser | null>(null);

    useEffect(() => {
        if (openThread !== null && openThread.id) {
            const secondPerson = find(
                openThread?.users,
                (u: PUser) => loginUser.id !== u.id
            ) as PUser;
            setOtherUser(secondPerson);
            setLoading(true);
            emitJoinChatThread(openThread.id);
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
        socket.on(EVENTS.CHAT_MESSAGE, ({ content, threadId, from }) => {
            if (otherUser && otherUser.id && loginUser && loginUser.id) {
                const senderId =
                    from === loginUser.id ? loginUser.id : otherUser.id;
                // eslint-disable-next-line no-console
                console.log(
                    messages,
                    "messages",
                    ChatMessage.createFrom(threadId, senderId, content)
                );
                setMessages([
                    ...messages,
                    ChatMessage.createFrom(threadId, senderId, content),
                ]);
            }
        });
        setClosed(openThread === null);
        return () => {
            if (openThread !== null && openThread.id) {
                emitLeaveChatThread(openThread.id);
            }
            socket.off(EVENTS.CHAT_MESSAGE);
        };
    }, [openThread]);

    if (closed === true || otherUser === null) {
        return null;
    }

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
                    user={otherUser}
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
                    onSendAction={(txt: string) => {
                        if (openThread && openThread.id) {
                            emitChatMessage(openThread.id, txt);
                        }
                    }}
                    onTypingAction={() => {
                        if (openThread && openThread.id) {
                            emitTyping(openThread.id);
                        }
                    }}
                />
            </div>
        </div>
    );
};
