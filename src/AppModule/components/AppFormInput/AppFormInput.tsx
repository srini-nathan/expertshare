import React, { FC, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { useInputPlaceholder } from "../../hooks";
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
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>(defaultValue);
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const { sm = 12, md = 6, lg = 4, xl = 4, className = "" } = props;
    const groupProps = { sm, md, lg, xl, controlId, as: Col };
    const labelProps = { label, required, maxCount, description };
    const controllerProps = { name, defaultValue, control };
    const controlProps = {
        placeholder: placeholderText,
        isValid,
        isInvalid,
        type,
    };

    let valueController = {};
    if (value)
        valueController = {
            value,
        };

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Form.Group {...groupProps} className={`mb-0 ${className}`}>
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
