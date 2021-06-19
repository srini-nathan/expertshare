import { atom } from "recoil";
import { PChatThread } from "../models/entities/ChatThread";

const KEY = "app-chat-one-to-one";

export const appChatOneToOne = atom<PChatThread | null>({
    key: KEY,
    default: null,
});
