import React, { FC } from "react";
import Select, { MenuPlacement } from "react-select";
import { ActionMeta, ValueType } from "react-select/src/types";
import { PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormDropdownProps {
    id: string;
    name?: string;
    className?: string;
    defaultValue: any;
    placeholder?: string;
    onChange?: (
        value: ValueType<PrimitiveObject, boolean>,
        actionMeta: ActionMeta<PrimitiveObject>
    ) => void;
    size?: "lg" | "sm";
    options: PrimitiveObject[];
    menuPlacement?: MenuPlacement;
    isLoading?: boolean;
}

export const AppFormDropdown: FC<AppFormDropdownProps> = ({
    id,
    defaultValue,
    name = "",
    className = "",
    placeholder = "",
    onChange = () => {},
    options,
    menuPlacement = "auto",
    isLoading = false,
}): JSX.Element => {
    return (
        <Select
            options={options}
            defaultValue={defaultValue}
            id={id}
            name={name}
            menuColor="red"
            onChange={onChange}
            placeholder={placeholder}
            className={`custom-select-container ${className}`}
            classNamePrefix="custom-select"
            isLoading={isLoading}
            menuPlacement={menuPlacement}
        />
    );
};
