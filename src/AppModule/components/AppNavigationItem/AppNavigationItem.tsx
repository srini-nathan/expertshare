import React, { FC } from "react";
import { Link } from "@reach/router";
import { ListGroupItem } from "react-bootstrap";
import styled from "styled-components";
import { AppIcon } from "../AppIcon";
import { AppNavigationItemProps } from "./AppNavigationItemProps";
import theme from "../../themes";

const { navigationItem } = theme;

const ListGroupItemWrapper = styled(ListGroupItem)`
    border: none !important;
    background-color: transparent !important;
    &:hover,
    &:focus {
        background-color: ${navigationItem.hover.bgColor} !important;
        color: ${navigationItem.hover.fgColor} !important;
    }
`;

const LinkWrapper = styled(Link)`
    &:hover,
    &:focus {
        text-decoration: none;
    }
`;

const IconWrapper = styled(AppIcon)``;

export const AppNavigationItem: FC<AppNavigationItemProps> = ({
    label,
    isActive = false,
    path,
    icon,
}) => {
    return (
        <ListGroupItemWrapper className={`${isActive ? "active" : ""}`}>
            <LinkWrapper to={path}>
                <IconWrapper {...icon}></IconWrapper>
                {label}
            </LinkWrapper>
        </ListGroupItemWrapper>
    );
};
