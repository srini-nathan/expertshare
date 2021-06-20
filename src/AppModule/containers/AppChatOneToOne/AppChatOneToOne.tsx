import React, { FC, useState, useEffect, useRef } from "react";
import { find } from "lodash";
import {
    AppLoader,
    // AppChatOneToOneHeader,
    // AppChatOneToOneComposer,
    // AppChatOneToOneMessage,
} from "../../components";
import { ChatMessage } from "../../models/entities/ChatMessage";
import {
    useAuthState,
    useInitChatOneToOne,
    useOpenChatOneToOne,
    // useChatSocketEvents,
} from "../../hooks";
import { PUser } from "../../../AdminModule/models";
// import { socket, EVENTS } from "../../socket";

import "./assets/scss/style.scss";
// import { ChatMessageApi } from "../../apis";

export const AppChatOneToOne: FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const pastMessages = useRef<ChatMessage[]>([]);
    const [data, setData] = useState<ChatMessage[]>([]);
    const { getMessages } = useInitChatOneToOne();
    const { user: loginUser } = useAuthState();
    const { openThread, set } = useOpenChatOneToOne();
    const [closed, setClosed] = useState(openThread === null);
    // const {
    //     emitJoinChatThread,
    //     emitLeaveChatThread,
    //     emitChatMessage,
    //     emitTyping,
    // } = useChatSocketEvents();
    const [otherUser, setOtherUser] = useState<PUser | null>(null);
    const bottomLine = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        bottomLine?.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    useEffect(() => {
        // if (openThread !== null && openThread.id) {
        //     const secondPerson = find(
        //         openThread?.users,
        //         (u: PUser) => loginUser.id !== u.id
        //     ) as PUser;
        //     setOtherUser(secondPerson);
        //     setLoading(true);
        //     emitJoinChatThread(openThread.id);
        //     getMessages(1, {
        //         "chatThread.id": openThread.id,
        //     })
        //         .then(({ response }) => {
        //             if (response && response.items) {
        //                 setData(response.items);
        //                 pastMessages.current = response.items;
        //             }
        //         })
        //         .finally(() => {
        //             setLoading(false);
        //             scrollToBottom();
        //         });
        // }
        // socket.on(EVENTS.CHAT_MESSAGE, (payload: ChatMessage) => {
        //     pastMessages.current.push(payload);
        //     setData([...pastMessages.current]);
        //     scrollToBottom();
        // });
        // setClosed(openThread === null);
        // return () => {
        //     if (openThread !== null && openThread.id) {
        //         emitLeaveChatThread(openThread.id);
        //     }
        //     socket.off(EVENTS.CHAT_MESSAGE);
        // };
    }, [openThread]);

    if (closed === true || otherUser === null) {
        return null;
    }

    return (
        <div className={`app-chat-one-to-one ${collapsed ? "collapsed" : ""}`}>
            <div className="inner-container">
                {/* <AppChatOneToOneHeader
                    onCollapseAction={() => {
                        setCollapsed(!collapsed);
                    }}
                    onCloseAction={() => {
                        set(null);
                    }}
                    user={otherUser}
                /> */}
                <div className="row m-0 px-0 pt-1 pb-3">
                    <div className="chat-list col-auto p-0 w-100">
                        <div className="chat-list--container p-3 ">
                            {/* {loading ? (
                                <AppLoader />
                            ) : (
                                data.map((t: ChatMessage) => (
                                    <AppChatOneToOneMessage
                                        key={t.id}
                                        chat={t}
                                        loginUser={loginUser}
                                        otherUser={otherUser}
                                    />
                                ))
                            )} */}
                            <div
                                style={{ float: "left", clear: "both" }}
                                ref={bottomLine}
                            ></div>
                        </div>
                    </div>
                </div>
                {/* <AppChatOneToOneComposer
                    onSendAction={(txt: string) => {
                        if (
                            openThread &&
                            openThread.id &&
                            loginUser &&
                            loginUser.id
                        ) {
                            const obj = ChatMessage.createFrom(
                                openThread.id,
                                loginUser.id,
                                txt
                            );
                            emitChatMessage(openThread.id, obj);
                            pastMessages.current.push(obj);
                            setData([...pastMessages.current]);
                            ChatMessageApi.create<ChatMessage, ChatMessage>(
                                obj
                            ).finally(() => {
                                scrollToBottom();
                            });
                        }
                    }}
                    onTypingAction={() => {
                        if (openThread && openThread.id) {
                            emitTyping(openThread.id);
                        }
                    }}
                /> */}
            </div>
        </div>
    );
};
