import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { appIconMap } from "./app-icon-map";

export interface AppIconProps {
    name: string;
    color?: string;
    size?: number;
    className?: string;
}

const ITag = styled.i``;

export const AppIcon: FunctionComponent<AppIconProps> = ({
    name,
    className = "",
    ...props
}) => {
    const IconTag = appIconMap[name] ?? ITag;
    return <IconTag className={className} {...props}></IconTag>;
};
