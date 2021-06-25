import { ChatThreadApi } from "../apis";
import { ListResponse, PrimitiveObject } from "../models";
import { FinalResponse } from "../models/apis/FinalResponse";
import { ChatThread } from "../models/entities/ChatThread";
import { User } from "../../AdminModule/models";
import { UserApi } from "../../AdminModule/apis";

type InitChatBoxType = {
    getThreads: (
        page: number,
        otherParams: PrimitiveObject
    ) => Promise<FinalResponse<ListResponse<ChatThread> | null>>;
    getAttendeeList: (
        page: number,
        otherParams: PrimitiveObject
    ) => Promise<FinalResponse<ListResponse<User> | null>>;
};

export function useInitChatBox(): InitChatBoxType {
    const getThreads = async (
        page = 1,
        otherParams = {}
    ): Promise<FinalResponse<ListResponse<ChatThread> | null>> => {
        return ChatThreadApi.find<ChatThread>(page, otherParams);
    };

    const getAttendeeList = async (
        page = 1,
        otherParams = {}
    ): Promise<FinalResponse<ListResponse<User> | null>> => {
        return UserApi.getAttendeeList<User>(page, otherParams);
    };

    return {
        getThreads,
        getAttendeeList,
    };
}
