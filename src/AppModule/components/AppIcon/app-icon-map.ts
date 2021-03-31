import {
    Grid,
    Briefcase,
    Users,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Trash2,
    Plus,
} from "react-feather";

import { ListTree } from "./app-custom-icons";
import { AppIconMap } from "../../models";

export const appIconMap: AppIconMap = {
    dashboard: Grid,
    Grid,
    sponsors: Briefcase,
    Briefcase,
    attendees: Users,
    Users,
    myAgenda: Calendar,
    Calendar,
    administrator: Settings,
    Settings,
    back: ChevronLeft,
    ChevronLeft,
    next: ChevronRight,
    ChevronRight,
    edit: Edit3,
    Edit3,
    delete: Trash2,
    Trash2,
    add: Plus,
    Plus,
    ListTree,
};
