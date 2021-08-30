import { joinQA, leaveQA, postNewQA, editQA, deleteQA } from "../socket";
import { PUser } from "../../AdminModule/models";
import { PSessionComment } from "../models/entities/SessionComment";
import { PExhibitorComment } from "../models/entities/ExhibitorComment";

type PComment = PSessionComment | PExhibitorComment;

type QASocketEventsType = {
    emitJoinQA: (socketParentId: string) => void;
    emitLeaveQA: (socketParentId: string) => void;
    emitPostNewQA: (
        socketParentId: string,
        user: PUser,
        payload: PComment,
        parentId: number | null
    ) => void;
    emitEditQA: (
        socketParentId: string,
        user: PUser,
        payload: PComment,
        parentId: number | null
    ) => void;
    emitDeleteQA: (socketParentId: string, id: number) => void;
};

export function useQASocketEvents(): QASocketEventsType {
    const emitJoinQA = (socketParentId: string): void => {
        joinQA(socketParentId);
    };

    const emitLeaveQA = (socketParentId: string): void => {
        leaveQA(socketParentId);
    };

    const emitPostNewQA = (
        socketParentId: string,
        user: PUser,
        payload: PComment,
        parentId: number | null = null
    ): void => {
        postNewQA(socketParentId, user, payload, parentId);
    };

    const emitEditQA = (
        socketParentId: string,
        user: PUser,
        payload: PComment,
        parentId: number | null = null
    ): void => {
        editQA(socketParentId, user, payload, parentId);
    };

    const emitDeleteQA = (socketParentId: string, id: number): void => {
        deleteQA(socketParentId, id);
    };

    return {
        emitJoinQA,
        emitLeaveQA,
        emitPostNewQA,
        emitEditQA,
        emitDeleteQA,
    };
}
