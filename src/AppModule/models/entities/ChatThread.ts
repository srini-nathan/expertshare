import { Container, User } from "../../../AdminModule/models";
import { ChatThreadApi } from "../../apis";
import { BaseEntity } from "./BaseEntity";
import { CONSTANTS } from "../../../config";

const {
    ChatThread: { THREAD, STATUS },
} = CONSTANTS;

export class ChatThread extends BaseEntity {
    name: string;

    threadType: string;

    status: string;

    container: string | Container;

    users: string[] | User[];

    constructor(
        users: string[],
        container: string,
        {
            name = "",
            threadType = THREAD.THREAD_TYPE_O2O,
            status = STATUS.STATUS_NEW,
            id,
            createdAt,
            updatedAt,
        }: Partial<ChatThread> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.users = users;
        this.name = name;
        this.threadType = threadType;
        this.status = status;
    }

    toString(): string {
        return ChatThreadApi.toResourceUrl(this.id);
    }
}

export type PChatThread = Partial<ChatThread>;
