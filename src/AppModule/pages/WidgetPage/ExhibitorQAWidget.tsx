import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { AppQuestionsAndAnswers } from "../../components";
import { useAuthState } from "../../hooks";
import { ExhibitorCommentsAPI } from "../../apis";
import "./assets/scss/style.scss";

export interface ExhibitorQAWidgetType {
    id: number;
}

export const ExhibitorQAWidget: FC<ExhibitorQAWidgetType> = ({
    id,
}): JSX.Element => {
    const { t } = useTranslation();
    const { containerId } = useAuthState();

    return (
        <div className={"exhibitor-qa-widget"}>
            <AppQuestionsAndAnswers
                name={t("exhibitor.detail:section.questionAndAnswers")}
                parentId={id}
                socketParentId={`exhibitor_${id}`}
                container={containerId}
                commentsAPI={ExhibitorCommentsAPI}
                parentElement="/api/exhibitor_comments"
                mainElement="api/exhibitors"
            />
        </div>
    );
};
