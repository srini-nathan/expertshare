import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import {
    AppRadio,
    AppSwitch,
    AppGridAction,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { LanguageApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";
import { AppGridActionParams } from "../../../AppModule/models";

export const appGridFrameworkComponents = {
    appSwitch: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { id, name, isActive, isDefault } = data as Language;

        if (isDefault) {
            return <></>;
        }

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
    appGridActionRenderer: (params: AppGridActionParams): ReactElement => {
        const {
            value,
            callback,
            editLink,
            addLink,
            listTree,
            listTreeSubUrl,
            ui,
            ...restProps
        } = params;
        const { data } = restProps;
        const { isDefault } = data as Language;

        return (
            <AppGridAction
                value={value}
                callback={callback}
                editLink={editLink}
                addLink={addLink}
                listTree={listTree}
                listTreeSubUrl={listTreeSubUrl}
                ui={ui}
                enableDelete={!isDefault}
                {...restProps}
            />
        );
    },
};
