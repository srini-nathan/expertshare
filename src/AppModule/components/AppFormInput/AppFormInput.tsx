import React, { FC, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import "./assets/scss/style.scss";
import { useInputPlaceholder } from "../../hooks";
import { AppFormLabel } from "../AppFormLabel";

export interface LayoutProps {
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
}

export interface ReactHookFormProps {
    name: string;
    defaultValue?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    isInvalid?: boolean;
    isValid?: boolean;
    errorMessage?: string;
}

export interface FormElementProps {
    id?: string;
    placeholder?: string | boolean;
    required?: boolean;
    label?: string;
    description?: string;
    className?: string;
}

export interface AppFormInputProps
    extends FormElementProps,
        LayoutProps,
        ReactHookFormProps {
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
