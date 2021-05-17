import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import {
    AppRadio,
    AppSwitch,
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { AppCellActionWithRenderParams } from "../../../AppModule/models";

export const appGridFrameworkComponents = {
    appSwitch: (params: ICellRendererParams): ReactElement => {
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
    appFormRadio: (params: ICellRendererParams): ReactElement => {
        const { data, api } = params;
        const { id, name, isDefault } = data as Language;
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
                                successToast("Default language changed.");
                            }
                        }
                    );
                }}
            ></AppRadio>
        );
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id, isDefault } = data as Language;

        const props: AppGridActionProps = {
            editAction: {
                disable: isDefault,
                url: `/admin/languages/${id}`,
            },
            deleteAction: {
                disable: isDefault,
                confirmation: "Are you sure want to delete ?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
