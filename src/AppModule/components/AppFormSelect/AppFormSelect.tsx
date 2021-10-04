import React, { FC } from "react";
import Select, { MenuPlacement } from "react-select";
import { Control, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import { PrimitiveObject } from "../../models";
import { useGridHelper } from "../../hooks";

import "./assets/scss/style.scss";

export interface AppFormSelectProps {
    id: string;
    name: string;
    defaultValue?: PrimitiveObject | string | number;
    placeholder?: string;
    label?: string;
    size?: "lg" | "sm";
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    options: PrimitiveObject[];
    menuPlacement?: MenuPlacement;
    required?: boolean;
    className?: string;
    description?: string;
    errorMessage?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform?: any;
    block?: boolean;
}

export const AppFormSelect: FC<AppFormSelectProps> = ({
    id,
    name,
    defaultValue,
    placeholder = "",
    options,
    menuPlacement = "auto",
    control,
    description,
    required = false,
    errorMessage,
    label = "",
    transform,
    block,
    ...props
}): JSX.Element => {
    const controlId = id || name;
    const {
        sm = 12,
        md = block ? 12 : 6,
        lg = block ? 12 : 4,
        xl = block ? 12 : 4,
        className = "",
    } = props;
    const { getColumnClasses } = useGridHelper();
    const colClasses = getColumnClasses(sm, md, lg, xl);

    return (
        <Form.Group
            className={`col form-group mb-0 ${colClasses} ${className}`}
            controlId={controlId}
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
                control={control}
                defaultValue={
                    defaultValue instanceof Object
                        ? defaultValue.value
                        : defaultValue
                }
                render={({ field }) => (
                    <Select
                        {...field}
                        defaultValue={defaultValue}
                        options={options}
                        placeholder={placeholder}
                        className="custom-select-container form-control"
                        classNamePrefix="custom-select"
                        menuPlacement={menuPlacement}
                        onChange={(e) => field.onChange(transform.output(e))}
                        value={transform.input(field.value)}
                        styles={{
                            option: (provided) => {
                                return {
                                    ...provided,
                                    zIndex: 9999999999,
                                };
                            },
                            menuList: (provided) => {
                                return {
                                    ...provided,
                                    backgroundColor: "blue",
                                };
                            },
                        }}
                    />
                )}
            />
            <span className="invalid-feedback d-block">
                {errorMessage && errorMessage}
            </span>
        </Form.Group>
    );
};
