import React, { FC } from "react";
import { Link, Match } from "@reach/router";
import { ListGroupItem } from "react-bootstrap";
import styled from "styled-components";
import { AppIcon } from "../AppIcon";
import { AppNavigationItemProps } from "./AppNavigationItemProps";

const IconWrapper = styled(AppIcon)``;

export const AppNavigationItem: FC<AppNavigationItemProps> = ({
    label,
    path,
    icon,
    className = "",
}) => {
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
                                <IconWrapper {...icon} />
                            </div>
                            <span>{label}</span>
                        </Link>
                    </ListGroupItem>
                );
            }}
        </Match>
    );
};
