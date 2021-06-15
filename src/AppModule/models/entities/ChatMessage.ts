import { ChatThread } from "./ChatThread";
import { User } from "../../../AdminModule/models";
import { ChatMessageApi } from "../../apis";
import { BaseEntity } from "./BaseEntity";
import { CONSTANTS } from "../../../config";

const {
    ChatMessage: { CONTENT, STATUS },
} = CONSTANTS;

export class ChatMessage extends BaseEntity {
    status: string;

    contentType: string;

    content: string;

    chatThread: string | ChatThread;

    user: string | User;

    constructor(
        chatThread: string,
        content: string,
        user: string,
        {
            status = STATUS.STATUS_NEW,
            contentType = CONTENT.CONTENT_TYPE_TEXT,
            id,
            createdAt,
            updatedAt,
        }: Partial<ChatMessage> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.chatThread = chatThread;
        this.content = content;
        this.contentType = contentType;
        this.status = status;
        this.user = user;
    }

    toString(): string {
        return ChatMessageApi.toResourceUrl(this.id);
    }
}
