import { atom } from "recoil";
import { Container } from "../../AdminModule/models";

const KEY = "app-my-container";

export const appMyContainer = atom<Container | null>({
    key: KEY,
    default: null,
});
