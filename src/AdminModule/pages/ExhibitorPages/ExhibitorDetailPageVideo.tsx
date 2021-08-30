import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { AppCard, renderStreams } from "../../../AppModule/components";
import { useBuildAssetPath } from "../../../AppModule/hooks";
import { ExhibitorVideoFileInfo } from "../../../config";

type ExhibitorDetailPageVideoType = {
    type?: string;
    url?: string;
};

export const ExhibitorDetailPageVideo: FC<ExhibitorDetailPageVideoType> = ({
    type,
    url,
}): JSX.Element => {
    const { t } = useTranslation();
    const videoBasePath = useBuildAssetPath(ExhibitorVideoFileInfo);

    const renderVideo = (sType: string, u: string) => {
        // @TODO: use constant, instead of hard-coded stream type
        const resolvedUrl = sType === "FILE" ? `${videoBasePath}/${u}` : u;
        return renderStreams(sType, resolvedUrl);
    };

    if (type && url && url !== "") {
        return (
            <AppCard className="exhibitor-detail--video p-4">
                <Row className={"mb-3"}>
                    <Col>
                        <h3 className="mb-0">
                            <i className="fak fa-video mr-2"></i>
                            {t("exhibitor.detail:section.corporateVideo")}
                        </h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className={"stream-player"}>
                            {renderVideo(type, url)}
                        </div>
                    </Col>
                </Row>
            </AppCard>
        );
    }

    return <></>;
};
