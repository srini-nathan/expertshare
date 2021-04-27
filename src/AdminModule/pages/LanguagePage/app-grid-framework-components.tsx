import React, { ReactElement } from "react";
import { Language } from "../../models";
import { AppRadio, AppSwitch } from "../../../AppModule/components";
import { LanguageApi } from "../../apis";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";
import { errorToast, successToast } from "../../../AppModule/utils";

export const appGridFrameworkComponents = {
    appSwitch: (params: never): ReactElement => {
        const { data } = params;
        const { id, name, isActive } = data as Language;
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
    appFormRadio: (params: never): ReactElement => {
        const { data } = params;
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
                                successToast("Default language changed.");
                            }
                        }
                    );
                }}
            ></AppRadio>
        );
    },
    appGridActionRenderer: AppGridAction,
};