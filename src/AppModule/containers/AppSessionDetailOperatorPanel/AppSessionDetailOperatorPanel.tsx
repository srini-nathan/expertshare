import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useIsGranted } from "../../hooks";
import { ROLES } from "../../../config";
import { AppButton, AppCard } from "../../components";
import { AppSessionDetailOperatorVotePanel } from "./AppSessionDetailOperatorVotePanel";
import "./assets/scss/style.scss";

interface AppSessionDetailOperatorPanelType {
    conferenceId: number;
    currentSessionId: number;
    nextSessionId: number | null;
    onClickSwitchNextSession: () => void;
}

export const AppSessionDetailOperatorPanel: FC<AppSessionDetailOperatorPanelType> = ({
    conferenceId,
    currentSessionId,
    nextSessionId,
    onClickSwitchNextSession,
}): JSX.Element => {
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const { t } = useTranslation();

    if (!isGrantedControl) {
        return <></>;
    }

    const renderSwitchNextSession = () => {
        if (nextSessionId) {
            return (
                <Row className="my-5 mx-0 px-2">
                    <Col className="p-0" sm={12} md={6} lg={3}>
                        <AppButton
                            onClick={onClickSwitchNextSession}
                            variant="secondary"
                        >
                            {t("sessionDetails:label.switchToNextSession")}
                        </AppButton>
                    </Col>
                </Row>
            );
        }

        return <></>;
    };

    return (
        <AppCard
            title={t("sessionDetails:section.operatorActions")}
            className={"mt-2 p-4 app-session-detail-operator-panel"}
        >
            {renderSwitchNextSession()}
            <AppSessionDetailOperatorVotePanel
                conferenceId={conferenceId}
                currentSessionId={currentSessionId}
            />
        </AppCard>
    );
};
