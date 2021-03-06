import { atom } from "recoil";

const KEY = "app-pip-player";

export interface AppPipPlayerType {
    isLive: boolean;
    streamType: string;
    streamUrl: string;
}

export const appPipPlayer = atom<AppPipPlayerType | null>({
    key: KEY,
    default: null,
});
