import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import {
    AppRadio,
    AppSwitch,
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { AppCellActionWithRenderWithCustom } from "./app-actions";

export const appGridFrameworkComponents = {
    AppSwitch: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { id, name, isActive, isDefault } = data as Language;

        return (
            <AppSwitch
                name={`${name}-${id}`}
                id={`${name}-${id}`}
                value={isActive}
                size={"sm"}
                onChange={(event) => {
                    LanguageApi.update<Language, Partial<Language>>(id, {
                        isActive: event.currentTarget.checked,
                    }).then();
                }}
                disabled={isDefault}
            />
        );
    },
    AppFormRadio: (params: ICellRendererParams): ReactElement => {
        const { data, api } = params;
        const { id, name, isDefault } = data as Language;
        const { t } = useTranslation();

        return (
            <AppRadio
                name={"isDefault"}
                defaultChecked={isDefault}
                id={`is-default-${name}-${id}`}
                onChange={() => {
                    LanguageApi.setDefaultLanguage<Language>(id).then(
                        ({ errorMessage, error }) => {
                            if (error) {
                                errorToast(errorMessage);
                            } else {
                                api.refreshServerSideStore({ purge: true });
                                successToast(
                                    t(
                                        "admin.language.list:defaultlanguage.toast.success"
                                    )
                                );
                            }
                        }
                    );
                }}
            ></AppRadio>
        );
    },
    AppGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { data, onPressDelete, onPressExport, onPressImport } = params;
        const { id, isDefault, locale } = data as Language;
        const { t } = useTranslation();

        const props: AppGridActionProps = {
            editAction: {
                disable: isDefault,
                url: `/admin/languages/${id}`,
            },
            deleteAction: {
                disable: isDefault,
                confirmation: t(
                    "admin.language.form:delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "admin.language.form:delete.confirmation.title"
                ),
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customClickActions: [
                {
                    icon: "CloudUpload",
                    onClick: () => {
                        onPressExport(locale);
                    },
                },
                {
                    icon: "CloudDownload",
                    onClick: () => {
                        onPressImport(locale);
                    },
                },
            ],
        };

        return <AppGridAction {...props} />;
    },
};
