import React, { FC, useState, useEffect, useRef } from "react";
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
import { ChatMessageApi } from "../../apis";

import "./assets/scss/style.scss";
import { findPercent } from "../../helpers/findScreenWidthPercent";

interface ICurrentChat {
    currentUser: PUser;
    secondUser: PUser;
    messages: ChatMessage[];
    isOpen: boolean;
    isLoading: boolean;
}

export const AppChatOneToOne: FC = () => {
    const SCREEN_WIDTH = window.screen.width;

    const CHAT_WIDTH = 364;
    const COLLAPSED_CHAT_WIDTH = 250;
    const PADDING = 20;

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [, setLoading] = useState(true);
    const pastMessages = useRef<ChatMessage[]>([]);
    const { getMessages } = useInitChatOneToOne();
    const { user: loginUser } = useAuthState();
    const { openThread } = useOpenChatOneToOne();
    const {
        emitJoinChatThread,
        emitLeaveChatThread,
        emitChatMessage,
        emitTyping,
    } = useChatSocketEvents();
    const [isCollapseChats, setCollapseChats] = useState<boolean>(false);
    const [openChats, setOpenChats] = useState<Array<ICurrentChat>>([]);
    const [currentOpenIndex, setCurrentIndex] = useState<number>(0);
    const bottomLine = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        bottomLine?.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const accessScreenWidth =
        SCREEN_WIDTH - (SCREEN_WIDTH / 100) * findPercent(SCREEN_WIDTH);

    const chatsWidth =
        CHAT_WIDTH * (openChats.length + 1) + PADDING * (openChats.length - 1);

    const collapseChatsWidth =
        COLLAPSED_CHAT_WIDTH * (openChats.length - 1) +
        CHAT_WIDTH * 2 +
        PADDING * (openChats.length - 1);

    useEffect(() => {
        if (openThread !== null && openThread.id) {
            const chats = [...openChats];
            let currentChat: ICurrentChat = {
                isOpen: true,
                messages: [],
                secondUser: {},
                currentUser: {},
                isLoading: true,
            };
            const isChatOpen = chats.find(
                (user: ICurrentChat) => user.currentUser.id === openThread.id
            );
            const secondPerson = find(
                openThread?.users,
                (u: PUser) => loginUser.id !== u.id
            ) as PUser;
            if (!isChatOpen) {
                currentChat = {
                    ...currentChat,
                    isOpen: !!isChatOpen,
                    secondUser: secondPerson,
                    currentUser: openThread,
                };
                chats.unshift(currentChat);
                setOpenChats(() => chats);
            }
            setLoading(true);
            emitJoinChatThread(openThread.id);
            getMessages(1, {
                "chatThread.id": openThread.id,
            })
                .then(({ response }) => {
                    if (response && response.items) {
                        if (!isChatOpen) {
                            currentChat.messages = response.items;
                            chats.shift();
                            chats.unshift(currentChat);
                        }
                    }
                })
                .finally(() => {
                    currentChat.isLoading = false;
                    setLoading(false);
                    scrollToBottom();
                    setCollapsed(false);
                });
            setOpenChats(() => chats);
        }
        socket.on(EVENTS.CHAT_MESSAGE, (payload: ChatMessage) => {
            pastMessages.current.push(payload);
            scrollToBottom();
        });
        return () => {
            if (openThread !== null && openThread.id) {
                emitLeaveChatThread(openThread.id);
            }
            setOpenChats([]);
            socket.off(EVENTS.CHAT_MESSAGE);
        };
    }, [openThread]);

    useEffect(() => {
        if (chatsWidth > accessScreenWidth) {
            if (collapseChatsWidth < accessScreenWidth) {
                setCollapseChats(true);
            } else {
                const chats = [...openChats];
                chats.pop();
                setOpenChats(chats);
                setCollapseChats(false);
            }
        }
    }, [
        collapseChatsWidth,
        chatsWidth,
        isCollapseChats,
        openChats,
        accessScreenWidth,
    ]);

    useEffect(() => {
        if (openThread && openThread.id) {
            setCurrentIndex(openThread.id);
        }
        if (!openChats.length) {
            setCollapseChats(false);
        }
    }, [openThread]);

    return (
        <>
            {openChats.map((user: ICurrentChat, index: number) => (
                <div
                    key={user.currentUser.id}
                    className={`app-chat-one-to-one ${
                        user.currentUser.id !== currentOpenIndex &&
                        isCollapseChats
                            ? "collapse-chat"
                            : ""
                    }`}
                >
                    <div className="inner-container">
                        <div
                            onClick={() => {
                                if (
                                    user.currentUser.id &&
                                    user.currentUser.id !== currentOpenIndex
                                ) {
                                    setCurrentIndex(user.currentUser.id);
                                } else {
                                    setCurrentIndex(0);
                                }
                            }}
                        >
                            <AppChatOneToOneHeader
                                onCollapseAction={() => {
                                    setCollapsed(!collapsed);
                                }}
                                onCloseAction={(e) => {
                                    e.stopPropagation();
                                    setOpenChats(() =>
                                        openChats.filter((chat) => {
                                            return (
                                                chat.currentUser.id !==
                                                user.currentUser.id
                                            );
                                        })
                                    );
                                }}
                                maxWidth={isCollapseChats}
                                user={user.secondUser}
                            />
                        </div>
                        <div className="row m-0 px-0 pb-3">
                            <div className="chat-list col-auto p-0 w-100">
                                <div className="chat-list--container p-3 ">
                                    {user.isLoading ? (
                                        <AppLoader />
                                    ) : (
                                        user.messages.map((t: ChatMessage) => (
                                            <AppChatOneToOneMessage
                                                key={t.id}
                                                chat={t}
                                                loginUser={loginUser}
                                                otherUser={user.secondUser}
                                            />
                                        ))
                                    )}
                                    <div
                                        style={{
                                            float: "left",
                                            clear: "both",
                                        }}
                                        ref={bottomLine}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="row m-0 px-3 py-0"> */}
                        {/*    <div className="tab col-auto p-0 mb-2 w-100"> */}
                        {/*        <div className="row m-0 p-0"> */}
                        {/*            <div className="tab--item active text col-4 pl-0 pr-2"> */}
                        {/*                <a href="#" className="px-3"> */}
                        {/*                    <i className="fak fa-text"></i> */}
                        {/*                    Text */}
                        {/*                </a> */}
                        {/*            </div> */}
                        {/*            <div className="tab--item audio col-4 pl-0 pr-2"> */}
                        {/*                <a */}
                        {/*                    href="#" */}
                        {/*                    className="px-3" */}
                        {/*                    onClick={(e) => { */}
                        {/*                        e.preventDefault(); */}
                        {/*                        makeAudioCall(loginUser, otherUser); */}
                        {/*                    }} */}
                        {/*                > */}
                        {/*                    <i className="fak fa-voice"></i> */}
                        {/*                    Audio */}
                        {/*                </a> */}
                        {/*            </div> */}
                        {/*            <div className="tab--item video col-4 pl-0 pr-1"> */}
                        {/*                <a */}
                        {/*                    href="#" */}
                        {/*                    className="px-3" */}
                        {/*                    onClick={(e) => { */}
                        {/*                        e.preventDefault(); */}
                        {/*                        makeVideoCall(loginUser, otherUser); */}
                        {/*                    }} */}
                        {/*                > */}
                        {/*                    <i className="fak fa-video"></i> */}
                        {/*                    Video */}
                        {/*                </a> */}
                        {/*            </div> */}
                        {/*        </div> */}
                        {/*    </div> */}
                        {/* </div> */}
                        <AppChatOneToOneComposer
                            onSendAction={(txt: string) => {
                                if (
                                    user.currentUser &&
                                    user.currentUser.id &&
                                    loginUser &&
                                    loginUser.id &&
                                    user.secondUser &&
                                    user.secondUser.id
                                ) {
                                    const obj = ChatMessage.createFrom(
                                        user.currentUser.id,
                                        loginUser.id,
                                        txt
                                    );
                                    emitChatMessage(
                                        user.currentUser.id,
                                        obj,
                                        user.secondUser.id
                                    );
                                    setOpenChats(() =>
                                        openChats.filter(
                                            (chat: ICurrentChat) => {
                                                return (
                                                    chat.currentUser.id !==
                                                    user.currentUser.id
                                                );
                                            }
                                        )
                                    );
                                    const chats = [...openChats];
                                    chats[index].messages.push(obj);
                                    setOpenChats(() => chats);
                                    pastMessages.current.push(obj);
                                    ChatMessageApi.create<
                                        ChatMessage,
                                        ChatMessage
                                    >(obj).finally(() => {
                                        scrollToBottom();
                                    });
                                }
                            }}
                            onTypingAction={() => {
                                if (user.currentUser && user.currentUser.id) {
                                    emitTyping(user.currentUser.id);
                                }
                            }}
                        />
                    </div>
                </div>
            ))}
        </>
    );
};
