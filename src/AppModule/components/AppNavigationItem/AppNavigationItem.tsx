import React, { FC } from "react";
import { Link, Match } from "@reach/router";
import { ListGroupItem } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppNavigationItemProps } from "./AppNavigationItemProps";
import { NavigationType } from "../../../AdminModule/models";

export const AppNavigationItem: FC<AppNavigationItemProps> = ({
    label,
    path,
    icon,
    className = "",
    onClick,
    containerNavigation,
}) => {
    const { t } = useTranslation();

    if (
        containerNavigation &&
        containerNavigation.type === NavigationType.EXTERNAL
    ) {
        return (
            <ListGroupItem
                className={`nav-item py-2 collapseable px-lg-4 ${className}`}
                onClick={() => {
                    if (onClick) {
                        onClick(false);
                    }
                }}
            >
                <a
                    href={path}
                    target={
                        containerNavigation.isOpenInNewWindow
                            ? "_blank"
                            : "_self"
                    }
                    className="nav-link"
                >
                    <div className="nav-icon">
                        <i className={icon.name} />
                    </div>
                    <span> {label} </span>
                </a>
            </ListGroupItem>
        );
    }

    return (
        <Match path={path}>
            {(props) => {
                return (
                    <ListGroupItem
                        className={`nav-item py-2 collapseable px-lg-4 ${className} ${
                            props.location.pathname.includes(path)
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            if (onClick) {
                                onClick(false);
                            }
                        }}
                    >
                        <Link to={path} className="nav-link">
                            <div className="nav-icon">
                                <i className={icon.name} />
                            </div>
                            <span>
                                {containerNavigation ? label : t(label)}
                            </span>
                        </Link>
                    </ListGroupItem>
                );
            }}
        </Match>
    );
};
