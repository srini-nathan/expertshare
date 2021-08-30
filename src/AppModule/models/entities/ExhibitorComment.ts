import { Container, User, Exhibitor } from "../../../AdminModule/models";
import { ExhibitorCommentsAPI } from "../../apis";
import { BaseEntity } from "./BaseEntity";
import { CONSTANTS } from "../../../config";
import { ContainerApi, UserApi, ExhibitorApi } from "../../../AdminModule/apis";
import { getRandomId, getUTCDate } from "../../utils";

const {
    ExhibitorComment: { STATUS },
} = CONSTANTS;

export class ExhibitorComment extends BaseEntity {
    message: string;

    status: string;

    isReplyed: boolean;

    parent: string | ExhibitorComment | null;

    container: string | Container;

    exhibitor: string | Exhibitor;

    user: string | User;

    constructor(
        exhibitor: string,
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
        }: PExhibitorComment = {}
    ) {
        super(id, createdAt, updatedAt);
        this.exhibitor = exhibitor;
        this.message = message;
        this.user = user;
        this.container = container;
        this.parent = parent;
        this.isReplyed = isReplied;
        this.status = status;
    }

    toString(): string {
        return ExhibitorCommentsAPI.toResourceUrl(this.id);
    }

    static createFrom(
        exhibitorId: number,
        message: string,
        userId: number,
        containerId: number,
        parentId: number | null = null,
        isReplied = true
    ): ExhibitorComment {
        const parent = parentId
            ? ExhibitorCommentsAPI.toResourceUrl(parentId)
            : null;
        return new ExhibitorComment(
            ExhibitorApi.toResourceUrl(exhibitorId),
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

export type PExhibitorComment = Partial<ExhibitorComment>;
