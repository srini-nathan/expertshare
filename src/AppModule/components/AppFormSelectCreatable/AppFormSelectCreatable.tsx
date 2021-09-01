import React, { FC } from "react";
import CreatableSelect from "react-select/creatable";
import { MenuPlacement } from "react-select";
import { Control, Controller } from "react-hook-form";
import { Form, Col } from "react-bootstrap";
import { PrimitiveObject } from "../../models";

import "./assets/scss/style.scss";

export interface AppFormSelectCreatableProps {
    id: string;
    name: string;
    value: PrimitiveObject[];
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
    onChangeHandler?: (value: any) => void;
}

export const AppFormSelectCreatable: FC<AppFormSelectCreatableProps> = ({
    id,
    name,
    value,
    placeholder = "",
    options,
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
    onChangeHandler = () => {},
}): JSX.Element => {
    const controlId = id || name;
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            controlId={controlId}
            className={`mb-0 ${className}`}
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
                render={({ field }) => (
                    <CreatableSelect
                        {...field}
                        isMulti
                        value={value}
                        options={options}
                        placeholder={placeholder}
                        className="custom-select-container form-control"
                        classNamePrefix="custom-select"
                        menuPlacement={menuPlacement}
                        onChange={onChangeHandler}
                    />
                )}
            />
            <span className="invalid-feedback d-block">
                {errorMessage && errorMessage}
            </span>
        </Form.Group>
    );
};
