import { FC } from "react";
import { IconProps } from "react-feather";

export interface AppIconMap {
    [index: string]: FC<IconProps>;
}
