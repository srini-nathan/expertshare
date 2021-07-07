import { atom } from "recoil";
import { PUser } from "../../AdminModule/models";

const KEY = "app-call-one-to-one";

export interface AppCallOneToOneType {
    from: PUser;
    to: PUser;
    isVideoCall: boolean;
    isIncomingCall: boolean;
}

export const appCallOneToOne = atom<AppCallOneToOneType | null>({
    key: KEY,
    default: null,
});
