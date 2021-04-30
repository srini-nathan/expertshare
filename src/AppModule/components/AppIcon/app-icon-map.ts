import {
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faCog,
    faUserFriends,
    faBars,
    faTrash,
    faPen,
    faPlus,
    faFolderTree,
    faTimes,
    faSearch,
    faThLarge,
    faArrowLeft,
} from "@fortawesome/pro-regular-svg-icons";
import { AppIconMap } from "../../models";

export const appIconMap: AppIconMap = {
    ChevronLeft: faChevronLeft,
    ChevronDown: faChevronDown,
    ArrowLeft: faArrowLeft,
    back: faChevronLeft,
    next: faChevronRight,
    administrator: faCog,
    Settings: faCog,
    Users: faUserFriends,
    dashboard: faThLarge,
    delete: faTrash,
    edit: faPen,
    add: faPlus,
    ListTree: faFolderTree,
    X: faTimes,
    Search: faSearch,
    Menu: faBars,
};
