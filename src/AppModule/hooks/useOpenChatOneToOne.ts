import { useRecoilState } from "recoil";
import { PChatThread } from "../models/entities/ChatThread";
import { appChatOneToOne } from "../atoms";

type OpenChatOneToOneType = {
    set: (chatThread: PChatThread | null) => void;
    openThread: PChatThread | null;
};

export function useOpenChatOneToOne(): OpenChatOneToOneType {
    const [value, setValue] = useRecoilState(appChatOneToOne);
    const set = (chatThread: PChatThread | null): void => {
        setValue(chatThread);
    };

    return {
        set,
        openThread: value,
    };
}
