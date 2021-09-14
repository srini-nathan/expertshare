/* eslint-disable */

import React, { FC, useEffect, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { SessionApi } from "../../../AdminModule/apis";
import { PConference } from "../../../AdminModule/models/entities";
import { useAuthState } from "../../hooks";
import { errorToast } from "../../utils";

// eslint-disable-next-line no-empty-pattern
export const LiveNowPage: FC<RouteComponentProps> = ({}): JSX.Element => {
    const { t } = useTranslation();
    const { containerId } = useAuthState();
    const [loading, isLoading] = useState<boolean>(true);

    // eslint-disable-next-line consistent-return
    const fetchData = async () => {
        isLoading(true);
        try {
            const sessionData = await SessionApi.getLiveSession<PConference>(
                {
                    "container.id": containerId,
                    isLive: true,
                }
            );
            const sessionId = sessionData?.response?.items[0].id;
            if (!sessionData.response) {
                errorToast(t("liveNow:error.message.reject"));
                return null;
            }
            if (sessionData.response.items[0].isLive) {
                navigate(`/event/${containerId}/session/${sessionId}`);
            } else {
                errorToast(t("liveNow:error.message.noLiveSession"));
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log("err : ", err);
        } finally {
            isLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <></>;
};
