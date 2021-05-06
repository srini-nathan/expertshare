import React, { FC } from "react";
import Select, { MenuPlacement } from "react-select";
import { ActionMeta, ValueType } from "react-select/src/types";
import { PrimitiveObject } from "../../models";
import "bootstrap/dist/css/bootstrap.css";

export interface AppFormSelectProps {
    id: string;
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
const customStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        borderBottom: "2px dotted #373943",
        color: state.isSelected ? "rgb(229,240,240)" : "black",
        backgroundColor: state.isSelected ? "#30B7A7" : "white",
    }),
    control: (provided: any) => ({
        ...provided,
        margin: "-8px",
    }),
    "single-value": (provided: any) => ({
        ...provided,
        display: "relative",
    }),
    indicator: (provided: any) => ({
        ...provided,
    }),
};
export const AppFormSelect: FC<AppFormSelectProps> = ({
    id,
    defaultValue,
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
            onChange={onChange}
            placeholder={placeholder}
            styles={customStyles}
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 form-control selectpicker mt-2 mb-2 ml-3"
            classNamePrefix="custom-select"
            menuPlacement={menuPlacement}
        />
    );
};
