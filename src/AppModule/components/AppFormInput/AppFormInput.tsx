import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { useGridHelper, useInputPlaceholder } from "../../hooks";
import { AppFormLabel } from "../AppFormLabel";
import {
    AppFormLayoutProps,
    AppReactHookFormProps,
    AppFormElementProps,
} from "../../models/components";

import "./assets/scss/style.scss";

export interface AppFormInputProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    type?: string;
    value?: string;
    maxCount?: number;
    onBlurHandler?: (value: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string) => void;
}

export const AppFormInput: FC<AppFormInputProps> = ({
    id,
    name,
    defaultValue = "",
    placeholder,
    errorMessage,
    label = "",
    type = "text",
    description,
    isInvalid,
    isValid,
    required = true,
    maxCount,
    control,
    value,
    onBlurHandler,
    onChange,
    block,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>(defaultValue);
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const {
        sm = 12,
        md = block ? 12 : 6,
        lg = block ? 12 : 4,
        xl = block ? 12 : 4,
        className = "",
    } = props;
    const labelProps = { label, required, maxCount, description };
    const controllerProps = { name, defaultValue, control };
    const controlProps = {
        placeholder: placeholderText,
        isValid,
        isInvalid,
        type,
    };
    const { getColumnClasses } = useGridHelper();
    const colClasses = getColumnClasses(sm, md, lg, xl);

    let valueController = {};
    if (value)
        valueController = {
            value,
        };

    return (
        <Form.Group
            className={`col form-group  mb-0 ${colClasses} ${className}`}
            controlId={controlId}
        >
            <AppFormLabel counter={data?.length} {...labelProps} />
            <Controller
                {...controllerProps}
                render={({ field }) => (
                    <Form.Control
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            setData(e.target.value);
                            if (onChange) onChange(e.target.value);
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            if (onBlurHandler) onBlurHandler(e);
                        }}
                        {...controlProps}
                        {...valueController}
                    />
                )}
            />
            <Form.Control.Feedback className={"d-block"} type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
