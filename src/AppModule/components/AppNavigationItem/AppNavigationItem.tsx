import React, { FC } from "react";
import { Link, Match } from "@reach/router";
import { ListGroupItem } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppNavigationItemProps } from "./AppNavigationItemProps";

export const AppNavigationItem: FC<AppNavigationItemProps> = ({
    label,
    path,
    icon,
    className = "",
}) => {
    const { t } = useTranslation();

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
                    >
                        <Link to={path} className="nav-link">
                            <div className="nav-icon">
                                <i className={icon.name} />
                            </div>
                            <span>{t(label)}</span>
                        </Link>
                    </ListGroupItem>
                );
            }}
        </Match>
    );
};
