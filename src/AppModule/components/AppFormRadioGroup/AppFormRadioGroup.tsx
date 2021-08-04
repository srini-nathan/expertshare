import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { Col, Form } from "react-bootstrap";
import "./assets/scss/style.scss";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
    SimpleObject,
} from "../../models";
import { AppFormLabel } from "../AppFormLabel";

export interface AppFormRadioGroupProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    options: SimpleObject<string | number>[];
}

export const AppFormRadioGroup: FC<AppFormRadioGroupProps> = ({
    id,
    name,
    errorMessage,
    label = "",
    description,
    isInvalid,
    isValid,
    required = false,
    options,
    control,
    defaultValue,
    ...props
}): JSX.Element => {
    const controlId = id || name;
    const labelProps = { label, required, description };
    const { sm = 12, md = 6, lg = 4, xl = 4, className = "" } = props;
    const groupProps = { sm, md, lg, xl, controlId, as: Col };
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Form.Group {...groupProps} className={`mb-0 ${className}`}>
            <AppFormLabel {...labelProps} />
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field }) => (
                    <div className={"form-check-inline"}>
                        {options.map(({ value, label: radioLabel }) => (
                            <Form.Check
                                key={value}
                                inline
                                type="radio"
                                className={"radio-button-text"}
                                id={`${controlId}_${value}`}
                                required={required}
                                label={radioLabel}
                                {...field}
                                value={value}
                                defaultChecked={defaultValue === value}
                            />
                        ))}
                    </div>
                )}
            ></Controller>
            <Form.Control.Feedback
                type="invalid"
                className={isInvalid && !isValid ? "d-inline" : ""}
            >
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
