import { atom } from "recoil";
import { Container } from "../../AdminModule/models";

export const KEY = "app-container";

export const appContainer = atom<Container | null>({
    key: KEY,
    default: null,
});
