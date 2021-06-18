import { io } from "socket.io-client";
import { SOCKET_HOST } from "./config/app-env";
import { ChatThreadApi } from "./apis";

export const socket = io(SOCKET_HOST, {
    transports: ["websocket"],
});

export const EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    PAGE_CHANGE: "on-page-change",
    USER_LOGIN: "on-user-login",
    USER_LOGOUT: "on-user-logout",
    JOIN_CHAT_THREAD: "join-chat-thread",
    LEAVE_CHAT_THREAD: "leave-chat-thread",
    TYPING_IN_CHAT_THREAD: "typing-chat-thread",
    TYPED_IN_CHAT_THREAD: "typed-chat-thread",
    CHAT_MESSAGE: "chat-message",
};

type OnPageChangePayload = {
    url: string;
    pageTitle: string;
    container: string;
    user?: string | null;
};

export const onPageChange = ({
    user = null,
    ...rest
}: OnPageChangePayload): void => {
    socket.emit(EVENTS.PAGE_CHANGE, {
        user,
        ...rest,
    });
};

type OnUserLoginPayload = {
    token: string | null;
    userId: number | null;
};

export const onUserLogin = ({ token, userId }: OnUserLoginPayload): void => {
    socket.emit(EVENTS.USER_LOGIN, {
        token,
        userId,
    });
};

export const onUserLogout = (): void => {
    socket.emit(EVENTS.USER_LOGOUT, {
        token: null,
        userId: null,
    });
};

export const joinChatThread = (threadId: number): void => {
    socket.emit(EVENTS.JOIN_CHAT_THREAD, {
        threadId,
    });
};

export const leaveChatThread = (threadId: number): void => {
    socket.emit(EVENTS.LEAVE_CHAT_THREAD, {
        threadId,
    });
};

export const typingInChatThread = (threadId: number): void => {
    socket.emit(EVENTS.TYPING_IN_CHAT_THREAD, {
        threadId,
    });
};

export const typedInChatThread = (threadId: number): void => {
    socket.emit(EVENTS.TYPED_IN_CHAT_THREAD, {
        threadId,
    });
};

export const sendChatMessage = (content: string, threadId: number): void => {
    if (socket.connected) {
        socket.emit(EVENTS.CHAT_MESSAGE, {
            threadId,
            content,
            chatThread: ChatThreadApi.toResourceUrl(threadId),
        });
    }
};
