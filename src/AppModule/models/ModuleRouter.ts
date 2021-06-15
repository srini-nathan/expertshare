import { FC } from "react";
import { RouteComponentProps } from "@reach/router";

export interface ModuleRouter {
    key: string;
    path: string;
    RouterPlug: FC<RouteComponentProps>;
    layout: "dashboard" | "auth";
}
