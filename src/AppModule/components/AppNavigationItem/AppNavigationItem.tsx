import React, { FC } from "react";
import { Link } from "@reach/router";
import { ListGroupItem } from "react-bootstrap";
import styled from "styled-components";
import { AppIcon } from "../AppIcon";
import { AppNavigationItemProps } from "./AppNavigationItemProps";

const IconWrapper = styled(AppIcon)``;

export const AppNavigationItem: FC<AppNavigationItemProps> = ({
    label,
    isActive = false,
    path,
    icon,
}) => {
    return (
        <ListGroupItem className={`${isActive ? "active" : ""}`}>
            <Link to={path}>
                <IconWrapper {...icon}></IconWrapper>
                {label}
            </Link>
        </ListGroupItem>
    );
};
