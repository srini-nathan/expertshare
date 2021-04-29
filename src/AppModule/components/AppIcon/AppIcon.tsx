import React, { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { appIconMap } from "./app-icon-map";

export interface AppIconProps {
    name: string;
    className?: string;
}

export const AppIcon: FunctionComponent<AppIconProps> = ({
    name,
    ...props
}) => {
    return <FontAwesomeIcon icon={appIconMap[name]} {...props} />;
};
