import { ChatThreadApi } from "../apis";
import { ListResponse } from "../models";
import { FinalResponse } from "../models/apis/FinalResponse";
import { ChatThread } from "../models/entities/ChatThread";

type InitChatBoxType = {
    getThreads: (
        page: number
    ) => Promise<FinalResponse<ListResponse<ChatThread> | null>>;
};

export function useInitChatBox(): InitChatBoxType {
    const getThreads = async (
        page = 1
    ): Promise<FinalResponse<ListResponse<ChatThread> | null>> => {
        return ChatThreadApi.find<ChatThread>(page);
    };

    return {
        getThreads,
    };
}
