import {
    joinAskSpeaker,
    leaveAskSpeaker,
    postNewAskSpeaker,
    editAskSpeaker,
    deleteAskSpeaker,
} from "../socket";
import { PUser } from "../../AdminModule/models";
import { SessionQuestion } from "../models/entities/SessionQuestion";

type PAskSpeakerQuestion = SessionQuestion;

type AskSpeakerSocketEventsType = {
    emitJoinAskSpeaker: (socketParentId: number) => void;
    emitLeaveAskSpeaker: (socketParentId: number) => void;
    emitPostNewAskSpeaker: (
        socketParentId: number,
        user: PUser,
        payload: PAskSpeakerQuestion,
        parentId: number | null
    ) => void;
    emitEditAskSpeaker: (
        socketParentId: number,
        user: PUser,
        payload: PAskSpeakerQuestion,
        parentId: number | null
    ) => void;
    emitDeleteAskSpeaker: (socketParentId: number, id: number) => void;
};

export function useAskSpeakerSocketEvents(): AskSpeakerSocketEventsType {
    const emitJoinAskSpeaker = (socketParentId: number): void => {
        joinAskSpeaker(socketParentId);
    };

    const emitLeaveAskSpeaker = (socketParentId: number): void => {
        leaveAskSpeaker(socketParentId);
    };

    const emitPostNewAskSpeaker = (
        socketParentId: number,
        user: PUser,
        payload: PAskSpeakerQuestion,
        parentId: number | null = null
    ): void => {
        postNewAskSpeaker(socketParentId, user, payload, parentId);
    };

    const emitEditAskSpeaker = (
        socketParentId: number,
        user: PUser,
        payload: PAskSpeakerQuestion,
        parentId: number | null = null
    ): void => {
        editAskSpeaker(socketParentId, user, payload, parentId);
    };

    const emitDeleteAskSpeaker = (socketParentId: number, id: number): void => {
        deleteAskSpeaker(socketParentId, id);
    };

    return {
        emitJoinAskSpeaker,
        emitLeaveAskSpeaker,
        emitPostNewAskSpeaker,
        emitEditAskSpeaker,
        emitDeleteAskSpeaker,
    };
}
