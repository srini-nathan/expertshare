import React, { FC } from "react";
import { Link, Match } from "@reach/router";
import { ListGroupItem } from "react-bootstrap";
import { AppSubNavigationItemProps } from "./AppSubNavigationItemProps";

export const AppNavigationSubMenuItem: FC<AppSubNavigationItemProps> = ({
    label,
    path,
    className = "",
}) => {
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
                            <span>{label}</span>
                        </Link>
                    </ListGroupItem>
                );
            }}
        </Match>
    );
};
