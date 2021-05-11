import React, { FC } from "react";
import { NavDropdown } from "react-bootstrap";
import { AppIcon } from "../AppIcon";

interface AppNavigationDropDownProps {
    label: string;
    className?: string;
    iconClassName?: string;
    path?: string;
    subDropDownItems?: AppNavigationDropDownProps[];
}

export const AppNavigationDropDown: FC<AppNavigationDropDownProps> = ({
    label,
    className = "",
    iconClassName = "",
    subDropDownItems = [],
}) => {
    const navDropdownTitle = (
        <>
            <div className="nav-icon ml-lg-2 img-container">
                <i className={`${iconClassName}`}></i>
            </div>
            <span>{label}</span>
            <AppIcon name="ChevronDown" />
        </>
    );

    return (
        <NavDropdown
            title={navDropdownTitle}
            className={`nav-link p-0 ${className}`}
            id="basic-nav-dropdown"
        >
            {subDropDownItems &&
                subDropDownItems.map((e) => {
                    return (
                        <NavDropdown.Item href={e.path} key={e.label}>
                            <div className="nav-icon img-container">
                                <i className={`${e.iconClassName}`}></i>
                            </div>
                            <span>{e.label}</span>
                        </NavDropdown.Item>
                    );
                })}
        </NavDropdown>
    );
};
