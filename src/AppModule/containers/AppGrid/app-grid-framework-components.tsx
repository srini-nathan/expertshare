import React from "react";
import { AppFormRadio, AppSwitch } from "../../components";
import { AppGridAction } from "../../components/AppGridAction";

export const appGridFrameworkComponents = {
    appSwitch: (params: any) => {
        const { value, name, id, onChange } = params;
        return (
            <AppSwitch
                name={`${name}id`}
                id={`${name}-${id}`}
                value={value}
                onChange={onChange}
            />
        );
    },
    appFormRadio: (params: any) => {
        const { value, data, name } = params;
        const { id } = data;
        return <AppFormRadio name={name} id={`${name}-${id}`} value={value} />;
    },
    appGridActionRenderer: AppGridAction,
};
