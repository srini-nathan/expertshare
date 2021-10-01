import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
    SimpleObject,
} from "../../models";
import { AppFormLabel } from "../AppFormLabel";
import { useGridHelper } from "../../hooks";

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
    block,
    ...props
}): JSX.Element => {
    const controlId = id || name;
    const labelProps = { label, required, description };
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
