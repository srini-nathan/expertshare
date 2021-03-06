import { Container, Session, User } from "../../../AdminModule/models";
import { SessionCommentsAPI } from "../../apis/SessionCommentsAPI";
import { BaseEntity } from "./BaseEntity";
import { ContainerApi } from "../../../AdminModule/apis/ContainerApi";
import { SessionApi } from "../../../AdminModule/apis/SessionApi";
import { UserApi } from "../../../AdminModule/apis/UserApi";
import { getRandomId, getUTCDate } from "../../utils";
import { CONSTANTS } from "../../../config";

const {
    SessionComment: { STATUS },
} = CONSTANTS;

export class SessionComment extends BaseEntity {
    message: string;

    status: string;

    isReplyed: boolean;

    parent: string | SessionComment | null;

    container: string | Container;

    session: string | Session;

    user: string | User;

    constructor(
        session: string,
        message: string,
        user: string,
        container: string,
        parent: string | null = null,
        isReplied = true,
        {
            status = STATUS.STATUS_NEW,
            id,
            createdAt,
            updatedAt,
        }: Partial<SessionComment> = {}
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
        return SessionCommentsAPI.toResourceUrl(this.id);
    }

    static createFrom(
        sessionId: number,
        message: string,
        userId: number,
        containerId: number,
        parentId: number | null = null,
        isReplied = true
    ): SessionComment {
        const parent = parentId
            ? SessionCommentsAPI.toResourceUrl(parentId)
            : null;
        return new SessionComment(
            SessionApi.toResourceUrl(sessionId),
            message,
            UserApi.toResourceUrl(userId),
            ContainerApi.toResourceUrl(containerId),
            parent,
            isReplied,
            {
                id: getRandomId(),
                createdAt: getUTCDate(),
            }
        );
    }
}

export type PSessionComment = Partial<SessionComment>;
