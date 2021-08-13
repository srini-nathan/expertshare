import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { AppGridAction, AppGridActionProps } from "../../components";
import { LiveVoteQuestion } from "../../../AdminModule/models";

export const appGridFrameworkComponents = {
    AppGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { data, onPressDelete, parentId, grandParentId } = params;
        const { id, isSelected } = data as LiveVoteQuestion;
        const { t } = useTranslation();

        const props: AppGridActionProps = {
            editAction: {
                disable: isSelected,
                url: `/admin/live-votes/${grandParentId}/${parentId}/${id}`,
            },
            deleteAction: {
                disable: isSelected,
                confirmation: t(
                    "sessionDetails:section.operatorActions.liveVote.delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "sessionDetails:section.operatorActions.liveVote.delete.confirmation.title"
                ),
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customLinkActions: [
                {
                    icon: "List2",
                    url: `/admin/live-votes-result/${id}`,
                },
                {
                    icon: "Chart",
                    url: `/admin/live-votes-result/${id}/overview`,
                },
            ],
        };

        return <AppGridAction {...props} />;
    },
};
