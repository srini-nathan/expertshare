import React, { ReactElement } from "react";
import { Language } from "../../models";
import { AppFormRadio, AppSwitch } from "../../../AppModule/components";
import { LanguageApi } from "../../apis";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";

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
            <AppFormRadio
                name={"isDefault"}
                id={`${name}-${id}`}
                defaultChecked={isDefault}
                onChange={(event) => {
                    LanguageApi.update<Language, Partial<Language>>(id, {
                        isDefault: event.currentTarget.checked,
                    }).then();
                }}
            />
        );
    },
    appGridActionRenderer: AppGridAction,
};
