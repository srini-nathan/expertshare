import React, { FunctionComponent } from "react";
import styled from "styled-components";

export interface AppIconProps {
    src?: string;
}

const Icon = styled.i<AppIconProps>`
    ${(props) => props.src && `mask-image: url("${props.src}");`}
`;

export const AppIcon: FunctionComponent<AppIconProps> = (props) => {
    return <Icon className={"icon"} {...props} />;
};
