import React, { FC } from "react";
import Select, { MenuPlacement } from "react-select";
import { ActionMeta, ValueType } from "react-select/src/types";
import { PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormDropdownProps {
    id: string;
    name?: string;
    defaultValue: any;
    placeholder?: string;
    onChange?: (
        value: ValueType<PrimitiveObject, boolean>,
        actionMeta: ActionMeta<PrimitiveObject>
    ) => void;
    size?: "lg" | "sm";
    options: PrimitiveObject[];
    menuPlacement?: MenuPlacement;
}

export const AppFormDropdown: FC<AppFormDropdownProps> = ({
    id,
    defaultValue,
    name = "",
    placeholder = "",
    onChange = () => {},
    options,
    menuPlacement = "auto",
}): JSX.Element => {
    return (
        // Todo: fixing the colro issues
        <Select
            options={options}
            defaultValue={defaultValue}
            id={id}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className="custom-select-container"
            classNamePrefix="custom-select"
            menuPlacement={menuPlacement}
        />
    );
};
