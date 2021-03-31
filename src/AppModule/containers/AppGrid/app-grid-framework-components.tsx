import React from "react";
import { AppFormRadio, AppSwitch } from "../../components";

export const appGridFrameworkComponents = {
    appSwitch: (params: any) => {
        const { value, data } = params;
        const { id } = data;
        return (
            <AppSwitch
                value={value}
                name={`isActive${id}`}
                defaultChecked={value}
            />
        );
    },
    appFormRadio: (params: any) => {
        const { value, data } = params;
        const { id } = data;
        return (
            <AppFormRadio
                value={id}
                name={`isDefault`}
                id={`is-default-${id}`}
                defaultChecked={value}
            />
        );
    },
};
