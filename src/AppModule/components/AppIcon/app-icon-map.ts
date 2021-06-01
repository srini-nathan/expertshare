import {
    faChevronLeft,
    faUser,
    faChevronRight,
    faChevronDown,
    faChevronUp,
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
    faSignOut,
    faEye,
    faEyeSlash,
    faClone,
    faBox,
    faMicrophone,
    faEnvelope,
    faDownload,
    faFilter,
    faUpload,
    faCloudDownload,
    faCloudUpload,
} from "@fortawesome/pro-regular-svg-icons";
import { AppIconMap } from "../../models";

export const appIconMap: AppIconMap = {
    ChevronLeft: faChevronLeft,
    container: faBox,
    ChevronDown: faChevronDown,
    ChevronUp: faChevronUp,
    ArrowLeft: faArrowLeft,
    back: faChevronLeft,
    next: faChevronRight,
    administrator: faCog,
    Settings: faCog,
    Users: faUserFriends,
    dashboard: faThLarge,
    CloudDownload: faCloudDownload,
    CloudUpload: faCloudUpload,
    delete: faTrash,
    edit: faPen,
    add: faPlus,
    ListTree: faFolderTree,
    X: faTimes,
    Search: faSearch,
    Menu: faBars,
    User: faUser,
    Eye: faEye,
    EyeOff: faEyeSlash,
    SignOut: faSignOut,
    faClone,
    Clone: faClone,
    Microphone: faMicrophone,
    Email: faEnvelope,
    Download: faDownload,
    Filter: faFilter,
    Upload: faUpload,
};
