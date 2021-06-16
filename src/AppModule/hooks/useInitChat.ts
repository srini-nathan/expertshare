import { ContainerApi, UserApi } from "../../AdminModule/apis";
import { ChatThreadApi } from "../apis";
import { FinalResponse } from "../models/apis/FinalResponse";
import { PChatThread } from "../models/entities/ChatThread";
import { CONSTANTS } from "../../config";

const {
    ChatThread: { THREAD, STATUS },
} = CONSTANTS;

type InitChatType = {
    startChat: (
        senderId: number,
        reciverId: number,
        cId: number
    ) => Promise<FinalResponse<PChatThread | null>>;
};

export function useInitChat(): InitChatType {
    const startChat = async (
        senderId: number,
        reciverId: number,
        cId: number
    ): Promise<FinalResponse<PChatThread | null>> => {
        return ChatThreadApi.create<PChatThread, PChatThread>({
            name: `${senderId} To ${reciverId}`,
            users: [
                UserApi.toResourceUrl(senderId),
                UserApi.toResourceUrl(reciverId),
            ],
            container: ContainerApi.toResourceUrl(cId),
            threadType: THREAD.THREAD_TYPE_O2O,
            status: STATUS.STATUS_NEW,
        });
    };

    return {
        startChat,
    };
}
