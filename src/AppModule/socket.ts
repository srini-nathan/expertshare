import { io } from "socket.io-client";
import { SOCKET_HOST } from "./config/app-env";
import { PChatMessage } from "./models/entities/ChatMessage";
import { PUser } from "../AdminModule/models";
import { PSessionComment } from "./models/entities/SessionComment";
import { SocketCommandPayload } from "./models";

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
    JOIN_DISCUSSION_QA: "join-discussion-qa",
    LEAVE_DISCUSSION_QA: "leave-discussion-qa",
    POST_NEW_DISCUSSION_QA: "post-new-discussion-qa",
    EDIT_DISCUSSION_QA: "edit-discussion-qa",
    DELETE_DISCUSSION_QA: "delete-discussion-qa",
    ON_NEW_DISCUSSION_QA: "on-new-discussion-qa",
    ON_EDIT_DISCUSSION_QA: "on-edit-discussion-qa",
    ON_DELETE_DISCUSSION_QA: "on-delete-discussion-qa",
    JOIN_COMMAND_CENTER: "join-command-center",
    NEW_COMMAND: "new-command",
    ON_NEW_COMMAND: "on-new-command",
    LEAVE_COMMAND_CENTER: "leave-command-center",
    JOIN_SESSION: "join-session",
    SUBMITTED_VOTE_RESULT: "submitted-vote-result",
    ON_SUBMITTED_VOTE_RESULT: "on-submitted-vote-result",
    REFRESH_LIVE_VOTE: "refresh-live-vote",
    ON_LIVE_VOTE_REFRESH: "on-live-vote-refresh",
    LEAVE_SESSION: "leave-session",
    JOIN_LIVE_VOTE_RESULT: "join-live-vote-result",
    REFRESH_LIVE_VOTE_RESULT: "refresh-live-vote-result",
    ON_REFRESH_LIVE_VOTE_RESULT: "on-refresh-live-vote-result",
    LEAVE_LIVE_VOTE_RESULT: "leave-live-vote-result",
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

export const joinQA = (socketParentId: string): void => {
    socket.emit(EVENTS.JOIN_DISCUSSION_QA, {
        socketParentId,
    });
};

export const leaveQA = (socketParentId: string): void => {
    socket.emit(EVENTS.LEAVE_DISCUSSION_QA, {
        socketParentId,
    });
};

export const postNewQA = (
    socketParentId: string,
    sender: PUser,
    payload: PSessionComment,
    parentId: number | null = null
): void => {
    socket.emit(EVENTS.POST_NEW_DISCUSSION_QA, {
        socketParentId,
        sender,
        payload,
        parentId,
    });
};

export const editQA = (
    socketParentId: string,
    sender: PUser,
    payload: PSessionComment,
    parentId: number | null = null
): void => {
    socket.emit(EVENTS.EDIT_DISCUSSION_QA, {
        socketParentId,
        sender,
        payload,
        parentId,
    });
};

export const deleteQA = (socketParentId: string, id: number): void => {
    socket.emit(EVENTS.DELETE_DISCUSSION_QA, {
        socketParentId,
        id,
    });
};

export const joinCommandCenter = (userId: number): void => {
    socket.emit(EVENTS.JOIN_COMMAND_CENTER, {
        userId,
    });
};

export const leaveCommandCenter = (userId: number): void => {
    socket.emit(EVENTS.LEAVE_COMMAND_CENTER, {
        userId,
    });
};

// @TODO: move this as a new model file under the models dir
export enum CommandType {
    NEW_AUDIO_CALL = "new-audio-call",
    DECLINED_AUDIO_CALL = "declined-audio-call",
    ACCEPT_AUDIO_CALL = "accept-audio-call",
    NEW_VIDEO_CALL = "new-video-call",
    DECLINED_VIDEO_CALL = "declined-video-call",
    ACCEPT_VIDEO_CALL = "accept-video-call",
    START_CALL_STREAM = "start-call-stream",
    JOIN_CALL_STREAM = "join-call-stream",
    JOINED_CALL_STREAM = "joined-call-stream",
    END_CALL_STREAM = "end-call-stream",
}

export const postNewCommand = (
    from: PUser,
    to: PUser,
    type: CommandType,
    payload: SocketCommandPayload
): void => {
    if (socket.connected) {
        socket.emit(EVENTS.NEW_COMMAND, {
            from,
            to,
            type,
            payload,
        });
    }
};

export const joinSession = (sessionId: number): void => {
    socket.emit(EVENTS.JOIN_SESSION, {
        sessionId,
    });
};

export const leaveSession = (sessionId: number): void => {
    socket.emit(EVENTS.LEAVE_SESSION, {
        sessionId,
    });
};

export const submittedVote = (sessionId: number, voteId: number): void => {
    socket.emit(EVENTS.SUBMITTED_VOTE_RESULT, {
        sessionId,
        voteId,
    });
};

export const refreshVote = (sessionId: number): void => {
    socket.emit(EVENTS.REFRESH_LIVE_VOTE, {
        sessionId,
    });
};

export const joinLiveVoteResult = (voteId: number): void => {
    socket.emit(EVENTS.JOIN_LIVE_VOTE_RESULT, {
        voteId,
    });
};

export const leaveLiveVoteResult = (voteId: number): void => {
    socket.emit(EVENTS.LEAVE_LIVE_VOTE_RESULT, {
        voteId,
    });
};
