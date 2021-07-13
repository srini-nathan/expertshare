import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { InfoPage } from "../../models";
import { AppCellActionWithRenderWithCustom } from "./app-actions";

export const appGridFrameworkComponents = {
    AppGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as InfoPage;
        const { t } = useTranslation();

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/info-pages/${id}`,
            },
            deleteAction: {
                confirmation: t(
                    "admin.infopage.form:delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "admin.infopage.form:delete.confirmation.title"
                ),
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
