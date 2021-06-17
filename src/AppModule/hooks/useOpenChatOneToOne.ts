import { useRecoilState } from "recoil";
import { PChatThread } from "../models/entities/ChatThread";
import { appChatOneToOne } from "../atoms";

type OpenChatOneToOneType = {
    set: (chatThread: PChatThread) => void;
    openThread: PChatThread | null;
};

export function useOpenChatOneToOne(): OpenChatOneToOneType {
    const [value, setValue] = useRecoilState(appChatOneToOne);
    const set = (chatThread: PChatThread): void => {
        setValue(chatThread);
    };

    return {
        set,
        openThread: value,
    };
}
