import React, { FC, useEffect, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { SessionApi } from "../../../AdminModule/apis";
import { PConference } from "../../../AdminModule/models/entities";
import { useAuthState } from "../../hooks";
import { errorToast } from "../../utils";
import { AppLoader } from "../../components/AppLoader";

export const LiveNowPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { containerId } = useAuthState();
    const [loading, isLoading] = useState<boolean>(true);

    const fetchData = async () => {
        isLoading(true);
        try {
            const sessionData = await SessionApi.getLiveSession<PConference>({
                "container.id": containerId,
                isLive: true,
            });

            if (!sessionData.response) {
                errorToast(t("liveNow:error.message.reject"));
                return null;
            }
            if (!sessionData?.response.items.length) {
                errorToast(t("liveNow:error.message.noLiveSession"));
                return null;
            }

            if (sessionData.response.items[0].isLive) {
                const sessionId = sessionData?.response?.items[0].id;
                navigate(`/event/${containerId}/session/${sessionId}`);
            } else {
                errorToast(t("liveNow:error.message.noLiveSession"));
            }
            return null;
        } finally {
            isLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <AppLoader />;
    }

    return <></>;
};
