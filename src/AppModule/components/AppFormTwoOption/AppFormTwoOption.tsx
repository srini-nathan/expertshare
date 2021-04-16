import React, { FC } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormTwoOptionProps {
    name?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    required?: boolean;
    label?: string;
    firstOptionLabel: string;
    secondOptionLabel: string;
    firstOptionValue: string;
    secondOptionValue: string;
    defaultValue?: string;
    description?: string;
    errorMessage?: string;
    invalid?: boolean;
}

export const AppFormTwoOption: FC<AppFormTwoOptionProps> = ({
    name,
    errorMessage,
    label = "",
    firstOptionLabel,
    secondOptionLabel,
    firstOptionValue,
    secondOptionValue,
    defaultValue,
    description,
    md,
    sm,
    lg,
    xl,
    invalid = false,
    required = false,
}): JSX.Element => {
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
            <Row className="button-group-buttons m-0">
                <Form.Check
                    type="radio"
                    id="first_option"
                    className="col-6"
                    required={required}
                    label={firstOptionLabel}
                    value={firstOptionValue}
                    name={name}
                    defaultChecked={defaultValue === firstOptionValue}
                />
                <Form.Check
                    type="radio"
                    id="second_option"
                    className="col-6"
                    required={required}
                    label={secondOptionLabel}
                    value={secondOptionValue}
                    name={name}
                    defaultChecked={defaultValue === secondOptionValue}
                />
            </Row>
            {invalid && (
                <Form.Control.Feedback type="invalid">
                    {errorMessage}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};
