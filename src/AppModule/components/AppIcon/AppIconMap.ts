import { FC } from "react";
import {
    IconProps,
    Grid,
    Briefcase,
    Users,
    Calendar,
    Settings,
} from "react-feather";

interface IAppIconMap {
    [index: string]: FC<IconProps>;
}

export const AppIconMap: IAppIconMap = {
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
};
