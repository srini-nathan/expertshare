import React, { FC } from "react";
import { Link } from "@reach/router";
import { AppIcon } from "../AppIcon";
import { AppNavigationItemProps } from "./AppNavigationItemProps";

export const AppNavigationItem: FC<AppNavigationItemProps> = ({
    label,
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
                <AppIcon {...icon} /> {label}
            </Link>
        </li>
    );
};
