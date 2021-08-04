import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useSetRecoilState } from "recoil";
import {
    useChosenContainer,
    useNavigator,
    useResolveEntryPage,
} from "../../hooks";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    normalLayout,
    overViewLayout,
} from "../../atoms";
import { AppLoader } from "../../components";

export const LandingHelper: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { isChosen } = useChosenContainer();
    const nav = useNavigator(navigate);
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );
    const { getPath } = useResolveEntryPage();

    useEffect(() => {
        setLayoutOptions((currVal) => {
            return {
                ...currVal,
                ...overViewLayout,
            };
        });
        return () => {
            setLayoutOptions((currVal) => {
                return {
                    ...currVal,
                    ...normalLayout,
                };
            });
        };
    });

    useEffect(() => {
        if (!isChosen()) {
            nav("/container").then();
        } else {
            nav(getPath()).then();
        }
    });
    return <AppLoader />;
};
