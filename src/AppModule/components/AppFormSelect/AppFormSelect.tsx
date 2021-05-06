import React, { FC } from "react";
import Select, { MenuPlacement } from "react-select";
import { ActionMeta, ValueType } from "react-select/src/types";
import { Control, Controller } from "react-hook-form";
import { Form, Col } from "react-bootstrap";
import { PrimitiveObject } from "../../models";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/scss/style.scss";

export interface AppFormSelectProps {
    id: string;
    name: string;
    defaultValue: any;
    placeholder?: string;
    label?: string;
    onChange?: (
        value: ValueType<PrimitiveObject, boolean>,
        actionMeta: ActionMeta<PrimitiveObject>
    ) => void;
    size?: "lg" | "sm";
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    options: PrimitiveObject[];
    value: any;
    menuPlacement?: MenuPlacement;
    required?: boolean;
    className?: string;
    description?: string;
    errorMessage?: string;
    control?: Control<any>;
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
    name,
    defaultValue,
    placeholder = "",
    onChange = () => {},
    options,
    value,
    menuPlacement = "auto",
    className = "",
    control,
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    required = false,
    errorMessage,
    label = "",
}): JSX.Element => {
    const controlId = id || name;
    return (
        // Todo: fixing the colro issues
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            controlId={controlId}
            className={className}
        >
            {label?.length > 0 ? (
                <Form.Label>
                    {label}
                    {required && <span className="required">*</span>}
                    {description && (
                        <div className="custom-input-description">
                            <span>i</span>
                            <div className="custom-input-description-content">
                                {description}
                            </div>
                        </div>
                    )}
                </Form.Label>
            ) : null}
            <Controller
                name={name}
                defaultValue={value}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={options}
                        defaultValue={defaultValue}
                        id={id}
                        name={name}
                        onChange={onChange}
                        value={value}
                        placeholder={placeholder}
                        styles={customStyles}
                        className="col-xl-12 col-lg-12 col-md-12 col-sm-12 form-control mt-2 mb-2"
                        classNamePrefix="custom-select"
                        menuPlacement={menuPlacement}
                    />
                )}
            />
            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
