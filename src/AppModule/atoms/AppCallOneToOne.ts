import { atom } from "recoil";
import { PUser } from "../../AdminModule/models";
import { PChatThread } from "../models/entities/ChatThread";

const KEY = "app-call-one-to-one";

export interface AppCallOneToOneType {
    from: PUser;
    to: PUser;
    threadId: PChatThread;
    isOpen: boolean;
}

export const appCallOneToOne = atom<AppCallOneToOneType | null>({
    key: KEY,
    default: null,
});
