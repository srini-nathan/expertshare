import { PropsWithChildren } from "react";
import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";

export interface AppIconMap {
    [index: string]: PropsWithChildren<IconDefinition>;
}
