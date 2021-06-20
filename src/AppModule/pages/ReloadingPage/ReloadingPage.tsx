import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { useNavigator } from "../../hooks";
import { AppLoader } from "../../components";

export const ReloadingPage: FC<RouteComponentProps> = (
    props: any
): JSX.Element => {
    const nav = useNavigator(props.navigate);

    useEffect(() => {
        if (
            props.location &&
            props.location.state &&
            props.location?.state?.url
        )
            nav(props.location?.state?.url).then();
    });
    return <AppLoader />;
};
