import { Container, Session, User } from "../../../AdminModule/models";
import { SessionCommentsAPI } from "../../apis";
import { BaseEntity } from "./BaseEntity";
import { JsonResponseData } from "../apis";
import { CONSTANTS } from "../../../config";
import { ContainerApi, SessionApi, UserApi } from "../../../AdminModule/apis";
import { getRandomId, getUTCDate } from "../../utils";

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

    toJSON(addExtraData = false): JsonResponseData {
        let data: JsonResponseData = {
            session: this.session as string,
            message: this.message,
            user: this.user as string,
            container: this.container as string,
            parent: this.parent as string,
            isReplyed: this.isReplyed,
            status: this.status,
        };
        if (addExtraData) {
            data = { ...data, ...super.toJSON(addExtraData) };
        }
        return data;
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
