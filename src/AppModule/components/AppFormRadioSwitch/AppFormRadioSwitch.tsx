import React, { FC } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { SimpleObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormRadioSwitchProps {
    // id?: string;
    fieldName: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    required?: boolean;
    label?: string;
    values: SimpleObject<string>[];
    // defaultValue?: string;
    description?: string;
    errorMessage?: string;
    invalid?: boolean;
    control?: Control<any>;
}

export const AppFormRadioSwitch: FC<AppFormRadioSwitchProps> = ({
    // id,
    fieldName,
    errorMessage,
    label = "",
    values,
    // defaultValue,
    description,
    md,
    sm,
    lg,
    xl,
    invalid = false,
    required = false,
    control,
}): JSX.Element => {
    const renderOptions = () => {
        return values.map((e, i) => {
            return (
                <Controller
                    name={fieldName}
                    defaultValue={false}
                    control={control}
                    render={({
                        field: { name, onChange, onBlur, value, ref },
                    }) => (
                        <Form.Check
                            key={i}
                            type="radio"
                            label={label}
                            onBlur={onBlur}
                            onChange={onChange}
                            checked={value}
                            name={name}
                            value={value}
                            ref={ref}
                        />
                    )}
                />
            );
        });
    };

    return (
        <Form.Group
            className="button-group"
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
        >
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
            <Row className="button-group-buttons m-0">{renderOptions()}</Row>
            {invalid && (
                <Form.Control.Feedback type="invalid">
                    {errorMessage}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};
