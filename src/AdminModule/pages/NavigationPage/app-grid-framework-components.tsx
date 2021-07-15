import React, { ReactElement } from "react";
import { findIndex } from "lodash";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { Container, Navigation } from "../../models";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { useGlobalData } from "../../../AppModule/contexts";
import { appContainerNavigation } from "../../../AppModule/atoms";
import { errorToast, successToast } from "../../../AppModule/utils";
import { ContainerApi } from "../../apis";

export const appGridFrameworkComponents = {
    AppTitleRender: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { defaultLanguage } = useGlobalData();
        const { data } = params;
        const { translations } = data as Navigation;
        let title = "";
        if (defaultLanguage && translations) {
            const { locale } = defaultLanguage;
            const index = findIndex(translations, (t) => t.locale === locale);
            title = translations[index].title;
        }
        return <>{title}</>;
    },
    AppGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { container } = useGlobalData();
        const { t } = useTranslation();
        const [navigation, setNavigation] = useRecoilState<Navigation[]>(
            appContainerNavigation
        );
        const { data } = params;
        const { key } = data as Navigation;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/navigations/${key}`,
            },
            deleteAction: {
                confirmation: t(
                    "admin.navigation.form:delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "admin.navigation.form:delete.confirmation.title"
                ),
                onClick: () => {
                    if (container) {
                        const newNavs = navigation.filter((n) => n.key !== key);
                        ContainerApi.update<Container, any>(container.id, {
                            navigation: newNavs,
                        }).then(({ response, errorMessage }) => {
                            if (errorMessage) {
                                errorToast(errorMessage);
                            } else if (response !== null) {
                                // @TODO: missing translations
                                successToast("Navigation deleted successfully");
                                setNavigation(newNavs);
                            }
                        });
                    }
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
