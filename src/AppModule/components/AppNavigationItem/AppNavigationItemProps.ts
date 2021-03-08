import { AppIconProps } from "../AppIcon";

export interface AppNavigationItemProps {
    label: string;
    path: string;
    icon: AppIconProps;
    isActive?: boolean;
}
