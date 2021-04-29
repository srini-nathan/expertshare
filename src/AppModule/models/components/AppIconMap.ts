import { PropsWithChildren } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface AppIconMap {
    [index: string]: PropsWithChildren<IconDefinition>;
}
