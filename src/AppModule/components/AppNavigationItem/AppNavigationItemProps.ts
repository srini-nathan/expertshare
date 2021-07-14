import { AppIconProps } from "../AppIcon";
import { AppSubNavigationItemProps } from "./AppSubNavigationItemProps";
import { Navigation } from "../../../AdminModule/models";

export interface AppNavigationItemProps {
    label: string;
    path: string;
    className?: string;
    icon: AppIconProps;
    isActive?: boolean;
    subNavigations?: AppSubNavigationItemProps[];
    onClick?: (value: boolean) => void;
    containerNavigation?: Navigation;
}
