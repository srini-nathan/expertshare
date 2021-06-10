import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useSetRecoilState } from "recoil";
import { useChosenContainer, useNavigator } from "../../hooks";
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
            nav("/containers/overview").then();
        } else {
            nav("/conferences/grid").then();
        }
    });
    return <AppLoader />;
};
