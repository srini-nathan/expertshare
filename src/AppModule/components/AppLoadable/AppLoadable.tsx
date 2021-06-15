import React from "react";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { timeout as wait } from "promise-timeout";
import {
    AppLoadableFallback,
    AppLoadableFallbackProps,
} from "../AppLoadableFallback";

export interface AppLoadableProps {
    fallbackProps?: AppLoadableFallbackProps;
    minDelay?: number;
    timeout?: number;
}

export const AppLoadable = (
    ComponentLoadable: PromiseLike<any>,
    props: AppLoadableProps = {}
) => {
    const { fallbackProps, minDelay = 2000, timeout = 8000 } = props;
    return loadable(
        () => wait(pMinDelay(ComponentLoadable, minDelay), timeout),
        {
            fallback: <AppLoadableFallback {...fallbackProps} />,
        }
    );
};

export default AppLoadable;
