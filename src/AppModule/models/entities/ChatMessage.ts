import { ChatThread } from "./ChatThread";
import { User } from "../../../AdminModule/models";
import { ChatMessageApi, ChatThreadApi } from "../../apis";
import { BaseEntity } from "./BaseEntity";
import { JsonResponseData } from "../apis";
import { CONSTANTS } from "../../../config";
import { UserApi } from "../../../AdminModule/apis";
import { getRandomId, getUTCDate } from "../../utils";

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

    toJSON(addExtraData = false): JsonResponseData {
        let data: JsonResponseData = {
            content: this.content,
            status: this.status,
            user: this.user as string,
            chatThread: this.chatThread as string,
            contentType: this.contentType,
        };
        if (addExtraData) {
            data = { ...data, ...super.toJSON(addExtraData) };
        }
        return data;
    }

    static createFrom(
        threadId: number,
        senderId: number,
        content: string
    ): ChatMessage {
        return new ChatMessage(
            ChatThreadApi.toResourceUrl(threadId),
            content,
            UserApi.toResourceUrl(senderId),
            {
                id: getRandomId(),
                createdAt: getUTCDate(),
            }
        );
    }
}

export type PChatMessage = Partial<ChatMessage>;
