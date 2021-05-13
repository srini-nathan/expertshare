import React, { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { AppIcon } from "../AppIcon";

interface AppNavigationDropDownProps {
    label: string;
    className?: string;
    iconClassName?: string;
    icon?: string;
    path?: string;
    subDropDownItems?: AppNavigationDropDownProps[];
    action?: () => Promise<void>;
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
            <AppIcon name="ChevronUp" />
        </>
    );
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div
            className="custom-dropdown-toggle d-flex"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </div>
    ));
    return (
        <Dropdown
            className={`nav-link ${className}`}
            id={`dropdown-button-drop-up`}
            drop={"up"}
        >
            <Dropdown.Toggle as={CustomToggle}>
                {navDropdownTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {subDropDownItems &&
                    subDropDownItems.map((e) => {
                        return (
                            <Dropdown.Item
                                onClick={e.action && e.action}
                                href={e.path}
                                key={e.label}
                            >
                                <div className="nav-icon img-container">
                                    {e.icon ? (
                                        <AppIcon name={e.icon} />
                                    ) : (
                                        <i className={`${e.iconClassName}`}></i>
                                    )}
                                </div>
                                <span>{e.label}</span>
                            </Dropdown.Item>
                        );
                    })}
            </Dropdown.Menu>
        </Dropdown>
    );
};
