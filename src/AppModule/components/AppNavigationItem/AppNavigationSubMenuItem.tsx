import React, { FC } from "react";
import { Link, Match } from "@reach/router";
import { useTranslation } from "react-i18next";
import { ListGroupItem } from "react-bootstrap";
import { AppSubNavigationItemProps } from "./AppSubNavigationItemProps";

export const AppNavigationSubMenuItem: FC<AppSubNavigationItemProps> = ({
    label,
    path,
    className = "",
}) => {
    const { t } = useTranslation();
    return (
        <Match path={path}>
            {(props) => {
                return (
                    <ListGroupItem
                        className={`nav-item px-lg-4 ${className} ${
                            props.location.pathname.includes(path)
                                ? "active"
                                : ""
                        }`}
                    >
                        <Link to={path} className="nav-link">
                            <span>{t(label)}</span>
                        </Link>
                    </ListGroupItem>
                );
            }}
        </Match>
    );
};
