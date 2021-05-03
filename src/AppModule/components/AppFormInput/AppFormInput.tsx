import React, { FC } from "react";
import { Form, Col } from "react-bootstrap";
import "./assets/scss/style.scss";
import { Control, Controller, useWatch } from "react-hook-form";
import { isString as _isString, startCase as _startCase } from "lodash";

export interface AppFormInputProps {
    id?: string;
    name: string;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    value?: string;
    type?: string;
    placeholder?: string | boolean;
    required?: boolean;
    label?: string;
    description?: string;
    errorMessage?: string;
    className?: string;
    isInvalid?: boolean;
    isValid?: boolean;
    withCounter?: boolean;
    maxCount?: number;
    control?: Control<any>;
}

export const AppFormInput: FC<AppFormInputProps> = ({
    id,
    name,
    value = "",
    placeholder,
    errorMessage,
    label = "",
    type = "text",
    className = "",
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    isInvalid,
    isValid,
    required = false,
    withCounter = false,
    maxCount = 25,
    control,
}): JSX.Element => {
    const controlId = id || name;
    let placeholderText = "";

    if (placeholder !== false) {
        placeholderText = _isString(placeholder)
            ? placeholder
            : `Enter ${_startCase(label) || _startCase(name)}`;
    }
    const fieldValue = useWatch({
        control,
        name,
        defaultValue: value,
    });
    return (
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
                    {(withCounter || maxCount !== 25) && (
                        <span className="counter">{`${fieldValue?.length}/${maxCount}`}</span>
                    )}
                </Form.Label>
            ) : null}
            <Controller
                name={name}
                defaultValue={value}
                control={control}
                render={({ field }) => (
                    <Form.Control
                        {...field}
                        type={type}
                        placeholder={placeholderText}
                        isValid={isValid}
                        isInvalid={isInvalid}
                    />
                )}
            />
            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
