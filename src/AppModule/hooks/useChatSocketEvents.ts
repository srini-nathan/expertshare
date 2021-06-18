import {
    joinChatThread,
    leaveChatThread,
    typedInChatThread,
    typingInChatThread,
    sendChatMessage,
} from "../socket";

type ChatSocketEventsType = {
    emitJoinChatThread: (threadId: number) => void;
    emitLeaveChatThread: (threadId: number) => void;
    emitTyping: (threadId: number) => void;
    emitStopTyping: (threadId: number) => void;
    emitChatMessage: (threadId: number, content: string) => void;
};

export function useChatSocketEvents(): ChatSocketEventsType {
    const emitJoinChatThread = (threadId: number): void => {
        joinChatThread(threadId);
    };

    const emitLeaveChatThread = (threadId: number): void => {
        leaveChatThread(threadId);
    };

    const emitTyping = (threadId: number): void => {
        typingInChatThread(threadId);
    };

    const emitStopTyping = (threadId: number): void => {
        typedInChatThread(threadId);
    };

    const emitChatMessage = (threadId: number, content: string): void => {
        sendChatMessage(content, threadId);
    };

    return {
        emitJoinChatThread,
        emitLeaveChatThread,
        emitTyping,
        emitStopTyping,
        emitChatMessage,
    };
}
