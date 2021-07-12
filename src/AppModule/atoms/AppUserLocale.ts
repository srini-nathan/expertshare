import { atom } from "recoil";

const KEY = "app-user-locale";

export const appUserLocale = atom<string>({
    key: KEY,
    default: "en",
});
