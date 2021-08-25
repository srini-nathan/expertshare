import {
    joinNextSession,
    leaveNextSession,
    switchNextSession,
    joinSessionQa,
    leaveSessionQa,
    postNewSessionQa,
    editSessionQa,
    deleteSessionQa,
    joinSession,
    leaveSession,
    submittedVote,
    refreshVote,
    joinLiveVoteResult,
    leaveLiveVoteResult,
} from "../socket";
import { PUser } from "../../AdminModule/models";
import { PSessionComment } from "../models/entities/SessionComment";

type SessionSocketEventsType = {
    emitJoinNextSession: (sessionId: number) => void;
    emitLeaveNextSession: (sessionId: number) => void;
    emitSwitchSessionNext: (sessionId: number) => void;
    emitJoinSessionQa: (socketParentId: string) => void;
    emitLeaveSessionQa: (socketParentId: string) => void;
    emitPostNewSessionQa: (
        socketParentId: string,
        user: PUser,
        payload: PSessionComment,
        parentId: number | null
    ) => void;
    emitEditSessionQa: (
        socketParentId: string,
        user: PUser,
        payload: PSessionComment,
        parentId: number | null
    ) => void;
    emitDeleteSessionQa: (socketParentId: string, id: number) => void;
    emitJoinSession: (sessionId: number) => void;
    emitLeaveSession: (sessionId: number) => void;
    emitSubmittedVote: (sessionId: number, voteId: number) => void;
    emitRefreshVote: (sessionId: number) => void;
    emitJoinLiveVoteResult: (voteId: number) => void;
    emitLeaveLiveVoteResult: (voteId: number) => void;
};

export function useSessionSocketEvents(): SessionSocketEventsType {
    const emitJoinNextSession = (sessionId: number): void => {
        joinNextSession(sessionId);
    };

    const emitLeaveNextSession = (sessionId: number): void => {
        leaveNextSession(sessionId);
    };

    const emitSwitchSessionNext = (sessionId: number): void => {
        switchNextSession(sessionId);
    };

    const emitJoinSessionQa = (socketParentId: string): void => {
        joinSessionQa(socketParentId);
    };

    const emitLeaveSessionQa = (socketParentId: string): void => {
        leaveSessionQa(socketParentId);
    };

    const emitPostNewSessionQa = (
        socketParentId: string,
        user: PUser,
        payload: PSessionComment,
        parentId: number | null = null
    ): void => {
        postNewSessionQa(socketParentId, user, payload, parentId);
    };

    const emitEditSessionQa = (
        socketParentId: string,
        user: PUser,
        payload: PSessionComment,
        parentId: number | null = null
    ): void => {
        editSessionQa(socketParentId, user, payload, parentId);
    };

    const emitDeleteSessionQa = (socketParentId: string, id: number): void => {
        deleteSessionQa(socketParentId, id);
    };

    const emitJoinSession = (sessionId: number): void => {
        joinSession(sessionId);
    };

    const emitLeaveSession = (sessionId: number): void => {
        leaveSession(sessionId);
    };

    const emitSubmittedVote = (sessionId: number, voteId: number): void => {
        submittedVote(sessionId, voteId);
    };

    const emitRefreshVote = (sessionId: number): void => {
        refreshVote(sessionId);
    };

    const emitJoinLiveVoteResult = (voteId: number): void => {
        joinLiveVoteResult(voteId);
    };

    const emitLeaveLiveVoteResult = (voteId: number): void => {
        leaveLiveVoteResult(voteId);
    };

    return {
        emitJoinNextSession,
        emitLeaveNextSession,
        emitSwitchSessionNext,
        emitJoinSessionQa,
        emitLeaveSessionQa,
        emitPostNewSessionQa,
        emitEditSessionQa,
        emitDeleteSessionQa,
        emitJoinSession,
        emitLeaveSession,
        emitSubmittedVote,
        emitRefreshVote,
        emitJoinLiveVoteResult,
        emitLeaveLiveVoteResult,
    };
}
