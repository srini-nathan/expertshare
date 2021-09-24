import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useSetRecoilState } from "recoil";
import {
    useAuthState,
    useChosenContainer,
    useNavigator,
    useResolveEntryPage,
    useSkipOnBoarding,
} from "../../hooks";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    normalLayout,
    overViewLayout,
} from "../../atoms";
import { AppLoader } from "../../components";
import { useGlobalData } from "../../contexts";
import { parseConfiguration } from "../../utils";

export const LandingHelper: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { isChosen } = useChosenContainer();
    const { isSkipOnBoarding } = useSkipOnBoarding();
    const { user } = useAuthState();
    const nav = useNavigator(navigate);
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );
    const { getPath } = useResolveEntryPage();
    const { container } = useGlobalData();
    const config = parseConfiguration(container);

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
        if (
            config.isOnboardingEnable &&
            user &&
            !user.isOnboarded &&
            !isSkipOnBoarding()
        ) {
            nav("/onboarding").then();
        } else if (!isChosen()) {
            nav("/container").then();
        } else {
            nav(getPath()).then();
        }
    });
    return <AppLoader />;
};
