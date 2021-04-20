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
}) => {
    return (
        <Match path={path}>
            {(props) => {
                return (
                    <ListGroupItem
                        className={`nav-item pt-2 pr-3 pl-3 p-2 ${
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
