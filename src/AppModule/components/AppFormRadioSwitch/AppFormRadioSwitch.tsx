import React, { FC } from "react";
import { Col, Form, ButtonGroup } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { SimpleObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormRadioSwitchProps {
    id?: string;
    name: string;
    // @TODO: make interface to handle common props
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    required?: boolean;
    label?: string;
    options: SimpleObject<string | number>[];
    defaultValue?: string | number;
    description?: string;
    errorMessage?: string;
    className?: string;
    isInvalid?: boolean;
    isValid?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>;
    onChange?: (value: string) => void;
}

export const AppFormRadioSwitch: FC<AppFormRadioSwitchProps> = ({
    id,
    name,
    defaultValue = "",
    errorMessage,
    label = "",
    className = "",
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    isInvalid,
    isValid,
    required = false,
    options,
    control,
    onChange = () => {},
}): JSX.Element => {
    const controlId = id || name;
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Form.Group
            className={`button-group p-0 ${className}`}
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
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
            <ButtonGroup toggle>
                {options.map(({ value, label: radioLabel }) => (
                    <Controller
                        key={value}
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <Form.Check
                                type="radio"
                                className={"radio-button-text"}
                                id={`${controlId}_${value}`}
                                required={required}
                                label={radioLabel}
                                {...field}
                                defaultChecked={defaultValue === value}
                                value={value}
                                onChange={(e) => {
                                    onChange(e.target.value);
                                }}
                            />
                        )}
                    ></Controller>
                ))}
            </ButtonGroup>
            <Form.Control.Feedback
                type="invalid"
                className={isInvalid && !isValid ? "d-inline" : ""}
            >
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
