import {
    joinNextSession,
    leaveNextSession,
    switchNextSession,
    joinSession,
    leaveSession,
    submittedVote,
    refreshVote,
    joinLiveVoteResult,
    leaveLiveVoteResult,
} from "../socket";

type SessionSocketEventsType = {
    emitJoinNextSession: (sessionId: number) => void;
    emitLeaveNextSession: (sessionId: number) => void;
    emitSwitchSessionNext: (sessionId: number) => void;
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
        emitJoinSession,
        emitLeaveSession,
        emitSubmittedVote,
        emitRefreshVote,
        emitJoinLiveVoteResult,
        emitLeaveLiveVoteResult,
    };
}
