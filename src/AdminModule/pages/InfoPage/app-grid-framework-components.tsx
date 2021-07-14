import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { findIndex } from "lodash";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { InfoPage, InfoPageTranslations } from "../../models";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { useGlobalData } from "../../../AppModule/contexts";

export const appGridFrameworkComponents = {
    AppTitleRender: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { defaultLanguage } = useGlobalData();
        const { data } = params;
        const { translations } = data as InfoPage;
        let title = "";
        if (defaultLanguage && translations) {
            const trans = Object.values(translations) as InfoPageTranslations[];
            const { locale } = defaultLanguage;
            const index = findIndex(trans, (t) => t.locale === locale);
            title = trans[index].title;
        }
        return <>{title}</>;
    },
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
