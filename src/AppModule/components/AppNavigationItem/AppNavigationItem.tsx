import React, { FC } from "react";
import { Link } from "@reach/router";
import { AppIcon, AppIconProps } from "../index";

interface AppNavigationItemProps {
    icon: AppIconProps;
    text: string;
    isActive: boolean;
    path: string;
}

const AppNavigationItem: FC<AppNavigationItemProps> = ({
    text,
    isActive = false,
    path,
    icon,
}) => {
    return (
        <li
            className={`nav-item pt-2 pr-3 pl-3 p-2 ${
                isActive ? "active" : ""
            }`}
        >
            <Link className="nav-link" to={path}>
                <AppIcon {...icon} /> {text}
            </Link>
        </li>
    );
};

export default AppNavigationItem;
