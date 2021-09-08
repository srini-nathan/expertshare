import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { AppLoader, renderStreams } from "../../components";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    normalLayout,
    overViewLayout,
} from "../../atoms";
import { AFramePanelApi } from "../../../AdminModule/apis";
import { AFramePanel } from "../../../AdminModule/models";
import { useBuildAssetPath } from "../../hooks";
import { AFramePanelMediaFileInfo } from "../../../config";
import "./assets/scss/style.scss";

export const AFramePanelPage: FC<RouteComponentProps> = (): JSX.Element => {
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );
    const { t } = useTranslation();
    const { id } = useParams();
    const [data, setData] = useState<AFramePanel>();
    const [loading, setLoading] = useState<boolean>(true);
    const basePath = useBuildAssetPath(AFramePanelMediaFileInfo);

    const renderVideo = () => {
        if (!data || !data?.source || !data?.sourceType) {
            return <p>{t("aframePanel:panelSource.notFound")}</p>;
        }
        const { sourceType, source } = data;
        // @TODO: use constant, instead of hard-coded stream type
        const resolvedUrl =
            sourceType === "FILE" ? `${basePath}/${source}` : source;
        return renderStreams(sourceType, resolvedUrl);
    };

    useEffect(() => {
        setLoading(true);
        AFramePanelApi.findById<AFramePanel>(id)
            .then(({ response }) => {
                if (response) {
                    setData(response);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

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

    if (loading) {
        return <AppLoader />;
    }

    return <div className={"aframe-panel-page"}>{renderVideo()}</div>;
};
