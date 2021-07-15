import { atom } from "recoil";
import { Navigation } from "../../AdminModule/models";

const KEY = "app-container-navigation";

export const appContainerNavigation = atom<Navigation[]>({
    key: KEY,
    default: [],
});
