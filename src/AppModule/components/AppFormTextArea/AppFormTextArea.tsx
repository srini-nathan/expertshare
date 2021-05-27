import React, { ChangeEventHandler, FC, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";

import "./assets/scss/style.scss";
import { useInputPlaceholder } from "../../hooks";
import { AppFormLabel } from "../AppFormLabel";

export interface AppFormTextAreaProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    maxCount?: number;
    rows?: number;
    onChange?: ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;
    disabled?: boolean;
    onBlurHandler?: (value: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const AppFormTextArea: FC<AppFormTextAreaProps> = ({
    id,
    name,
    defaultValue = "",
    placeholder,
    errorMessage,
    label = "",
    description,
    disabled = false,
    isInvalid,
    isValid,
    required = true,
    maxCount,
    control,
    rows = 5,
    onChange,
    onBlurHandler,
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
        rows,
    };

    return (
        <Form.Group {...groupProps} className={`mb-0 ${className}`}>
            <AppFormLabel counter={data?.length} {...labelProps} />
            <Controller
                {...controllerProps}
                render={({ field }) => (
                    <Form.Control
                        {...field}
                        as="textarea"
                        disabled={disabled}
                        onChange={(e) => {
                            if (onChange) {
                                onChange(e);
                            }
                            field.onChange(e);
                            setData(e.target.value);
                        }}
                        onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                            if (onBlurHandler) onBlurHandler(e);
                        }}
                        {...controlProps}
                    />
                )}
            />
            <Form.Control.Feedback className=" d-block" type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
