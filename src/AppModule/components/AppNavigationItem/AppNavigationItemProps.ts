import { AppIconProps } from "../AppIcon";
import { AppSubNavigationItemProps } from "./AppSubNavigationItemProps";

export interface AppNavigationItemProps {
    label: string;
    path: string;
    icon: AppIconProps;
    isActive?: boolean;
    subNavigations?: AppSubNavigationItemProps[];
}
