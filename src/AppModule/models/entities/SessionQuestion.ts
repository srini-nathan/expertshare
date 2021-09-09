import { Container, Session, User } from "../../../AdminModule/models";
import { BaseEntity } from "./BaseEntity";
import { CONSTANTS } from "../../../config";
import { SessionQuestionApi } from "../../apis/SessionQuestionApi";
import { ContainerApi, SessionApi, UserApi } from "../../../AdminModule/apis";

const {
    SessionQuestion: { STATUS },
} = CONSTANTS;

export class SessionQuestion extends BaseEntity {
    message: string;

    status: string;

    isReplyed: boolean;

    parent: string | SessionQuestion | null;

    container: string | Container;

    session: string | Session;

    user: string | User;

    constructor(
        session: string,
        message: string,
        user: string,
        container: string,
        parent: string | null = null,
        isReplied = false,
        {
            status = STATUS.STATUS_NEW,
            id,
            createdAt,
            updatedAt,
        }: Partial<PSessionQuestion> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.session = session;
        this.message = message;
        this.user = user;
        this.container = container;
        this.parent = parent;
        this.isReplyed = isReplied;
        this.status = status;
    }

    toString(): string {
        return SessionQuestionApi.toResourceUrl(this.id);
    }

    static createFrom(
        sessionId: number,
        message: string,
        userId: number,
        containerId: number,
        parentId: number | null = null,
        isReplied = true
    ): SessionQuestion {
        const parent = parentId
            ? SessionQuestionApi.toResourceUrl(parentId)
            : null;
        return new SessionQuestion(
            SessionApi.toResourceUrl(sessionId),
            message,
            UserApi.toResourceUrl(userId),
            ContainerApi.toResourceUrl(containerId),
            parent,
            isReplied
        );
    }
}

export type PSessionQuestion = Partial<SessionQuestion>;
