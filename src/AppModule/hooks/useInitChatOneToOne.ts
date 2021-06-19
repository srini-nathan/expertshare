import { ChatMessageApi } from "../apis";
import { ListResponse, PrimitiveObject } from "../models";
import { FinalResponse } from "../models/apis/FinalResponse";
import { ChatMessage } from "../models/entities/ChatMessage";

type InitChatOneToOneType = {
    getMessages: (
        page: number,
        params: PrimitiveObject
    ) => Promise<FinalResponse<ListResponse<ChatMessage> | null>>;
};

export function useInitChatOneToOne(): InitChatOneToOneType {
    const getMessages = async (
        page = 1,
        params = {}
    ): Promise<FinalResponse<ListResponse<ChatMessage> | null>> => {
        return ChatMessageApi.find<ChatMessage>(page, params);
    };

    return {
        getMessages,
    };
}
