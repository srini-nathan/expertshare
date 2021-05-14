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
    maxCount?: number;
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
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>(defaultValue);
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const { sm = 12, md = 6, lg = 4, xl = 4, className = "" } = props;
    const groupProps = { sm, md, lg, xl, controlId, className, as: Col };
    return (
        <Form.Group {...groupProps}>
            <AppFormLabel
                label={label}
                required={required}
                counter={data?.length}
                maxCount={maxCount}
                description={description}
            />
            <Controller
                name={name}
                defaultValue={defaultValue}
                control={control}
                render={({ field }) => (
                    <Form.Control
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            setData(e.target.value);
                        }}
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
