import React from "react";
import { Language } from "../../models";
import { AppFormRadio, AppSwitch } from "../../../AppModule/components";
import { LanguageApi } from "../../apis/LanguageApi";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";

export const appGridFrameworkComponents = {
    appSwitch: (params: any) => {
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
    appFormRadio: (params: any) => {
        const { data, onChange } = params;
        const { id, name, isDefault } = data as Language;
        return (
            <AppFormRadio
                name={`${name}`}
                id={`${name}-${id}`}
                value={isDefault}
                onChange={onChange}
            />
        );
    },
    appGridActionRenderer: AppGridAction,
};
