import { ChatThreadApi } from "../apis";
import { ListResponse, PrimitiveObject } from "../models";
import { FinalResponse } from "../models/apis/FinalResponse";
import { ChatThread } from "../models/entities/ChatThread";

type InitChatBoxType = {
    getThreads: (
        page: number,
        otherParams: PrimitiveObject
    ) => Promise<FinalResponse<ListResponse<ChatThread> | null>>;
};

export function useInitChatBox(): InitChatBoxType {
    const getThreads = async (
        page = 1,
        otherParams = {}
    ): Promise<FinalResponse<ListResponse<ChatThread> | null>> => {
        return ChatThreadApi.find<ChatThread>(page, otherParams);
    };

    return {
        getThreads,
    };
}
