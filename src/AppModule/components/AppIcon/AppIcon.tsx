import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { AppIconMap } from "./AppIconMap";
import dashboard from "./assets/images/icon_dashboard.svg";

export interface AppIconProps {
    name: string;
}

const Icon = styled.i<AppIconProps>`
    display: inline-block;
    height: 2.75rem;
    width: 2.75rem;
    mask-repeat: no-repeat;
    mask-size: 2rem;
    mask-position: center;
    background-color: #36989c;
    mask-image: url("${(props) => AppIconMap[props.name]}");
`;

export const AppIcon: FunctionComponent<AppIconProps> = (props) => {
    return <Icon className={"icon"} {...props} />;
};
