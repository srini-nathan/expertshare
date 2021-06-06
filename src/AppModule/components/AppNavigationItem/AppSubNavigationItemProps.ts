import { AppIconProps } from "../AppIcon";

export interface AppSubNavigationItemProps {
    label: string;
    path: string;
    isActive?: boolean;
    className?: string;
    icon: AppIconProps;
    roles?: string[];
}
