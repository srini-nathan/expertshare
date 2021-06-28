import { io } from "socket.io-client";
import { SOCKET_HOST } from "./config/app-env";
import { PChatMessage } from "./models/entities/ChatMessage";
import { PUser } from "../AdminModule/models";
import { PSessionComment } from "./models/entities/SessionComment";

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
    JOIN_NEXT_SESSION: "join-next-session",
    LEAVE_NEXT_SESSION: "leave-next-session",
    ON_NEXT_SESSION: "on-next-session",
    SWITCH_NEXT_SESSION: "switch-next-session",
    NEW_MESSAGE: "new-message",
    JOIN_SESSION_QA: "join-session-qa",
    LEAVE_SESSION_QA: "leave-session-qa",
    POST_NEW_SESSION_QA: "post-new-session-qa",
    ON_NEW_SESSION_QA: "on-new-session-qa",
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

export const sendChatMessage = (
    threadId: number,
    payload: PChatMessage,
    sendTo: number
): void => {
    if (socket.connected) {
        socket.emit(EVENTS.CHAT_MESSAGE, {
            threadId,
            payload,
            sendTo,
        });
    }
};

export const joinNextSession = (sessionId: number): void => {
    socket.emit(EVENTS.JOIN_NEXT_SESSION, {
        sessionId,
    });
};

export const leaveNextSession = (sessionId: number): void => {
    socket.emit(EVENTS.LEAVE_NEXT_SESSION, {
        sessionId,
    });
};

export const switchNextSession = (sessionId: number): void => {
    socket.emit(EVENTS.SWITCH_NEXT_SESSION, {
        sessionId,
    });
};

export const joinSessionQa = (sessionId: number): void => {
    socket.emit(EVENTS.JOIN_SESSION_QA, {
        sessionId,
    });
};

export const leaveSessionQa = (sessionId: number): void => {
    socket.emit(EVENTS.LEAVE_SESSION_QA, {
        sessionId,
    });
};

export const postNewSessionQa = (
    sessionId: number,
    sender: PUser,
    payload: PSessionComment,
    parentId: number | null = null
): void => {
    socket.emit(EVENTS.POST_NEW_SESSION_QA, {
        sessionId,
        sender,
        payload,
        parentId,
    });
};
