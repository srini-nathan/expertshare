import React, { FC } from "react";
import Select from "react-select";
import { ActionMeta, ValueType } from "react-select/src/types";
import { SimpleObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormDropdownProps {
    id: string;
    value: any;
    placeholder?: string;
    onChange?: (
        value: ValueType<SimpleObject<string>, boolean>,
        actionMeta: ActionMeta<SimpleObject<string>>
    ) => void;
    size?: "lg" | "sm";
    options: SimpleObject<string>[];
}

export const AppFormDropdown: FC<AppFormDropdownProps> = ({
    id,
    value,
    placeholder = "",
    onChange = () => {},
    options,
}): JSX.Element => {
    return (
        <Select
            options={options}
            value={value}
            id={id}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};
