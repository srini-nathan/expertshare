import { atom } from "recoil";
import { Exhibitor } from "../../AdminModule/models/entities/Exhibitor";

const KEY = "app-exhibitors";

export const appExhibitors = atom<Exhibitor[] | null>({
    key: KEY,
    default: null,
});
