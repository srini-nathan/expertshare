import {
    joinNextSession,
    leaveNextSession,
    switchNextSession,
    joinSessionQa,
    leaveSessionQa,
    postNewSessionQa,
} from "../socket";
import { PUser } from "../../AdminModule/models";
import { PSessionComment } from "../models/entities/SessionComment";

type SessionSocketEventsType = {
    emitJoinNextSession: (sessionId: number) => void;
    emitLeaveNextSession: (sessionId: number) => void;
    emitSwitchSessionNext: (sessionId: number) => void;
    emitJoinSessionQa: (sessionId: number) => void;
    emitLeaveSessionQa: (sessionId: number) => void;
    emitPostNewSessionQa: (
        sessionId: number,
        user: PUser,
        payload: PSessionComment,
        parentId: number | null
    ) => void;
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

    const emitJoinSessionQa = (sessionId: number): void => {
        joinSessionQa(sessionId);
    };

    const emitLeaveSessionQa = (sessionId: number): void => {
        leaveSessionQa(sessionId);
    };

    const emitPostNewSessionQa = (
        sessionId: number,
        user: PUser,
        payload: PSessionComment,
        parentId: number | null = null
    ): void => {
        postNewSessionQa(sessionId, user, payload, parentId);
    };

    return {
        emitJoinNextSession,
        emitLeaveNextSession,
        emitSwitchSessionNext,
        emitJoinSessionQa,
        emitLeaveSessionQa,
        emitPostNewSessionQa,
    };
}
