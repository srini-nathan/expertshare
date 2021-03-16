import { FC } from "react";
import { Resource } from "i18next";
import { RouteComponentProps } from "@reach/router";

export interface ModuleConfigInterface {
    id: string;
    translations: Resource;
    routers?: ModuleRouter[];
    navigation?: any[];
}

export interface ModuleRouter {
    key: string;
    path: string;
    RouterPlug: FC<RouteComponentProps>;
    layout: "dashboard" | "auth";
}
