import { useState } from "react";
import { ContainerApi, UserApi } from "../../AdminModule/apis";
import { ChatThreadApi } from "../apis";
import { PChatThread } from "../models/entities/ChatThread";
import { CONSTANTS } from "../../config";
import { useOpenChatOneToOne } from "./useOpenChatOneToOne";

const {
    ChatThread: { THREAD, STATUS },
} = CONSTANTS;

type InitChatType = {
    startChat: (senderId: number, receiverId: number, cId: number) => void;
    loading: boolean;
};

export function useInitChat(): InitChatType {
    const [loading, setLoading] = useState<boolean>(false);
    const { set } = useOpenChatOneToOne();

    const startChat = (
        senderId: number,
        receiverId: number,
        cId: number
    ): void => {
        setLoading(true);
        ChatThreadApi.create<PChatThread, PChatThread>({
            name: `${senderId} To ${receiverId}`,
            users: [
                UserApi.toResourceUrl(senderId),
                UserApi.toResourceUrl(receiverId),
            ],
            container: ContainerApi.toResourceUrl(cId),
            threadType: THREAD.THREAD_TYPE_O2O,
            status: STATUS.STATUS_NEW,
        }).then(({ response }) => {
            if (response !== null) {
                set(response);
            }
        });
    };

    return {
        startChat,
        loading,
    };
}
