import React, { FC } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { SimpleObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormRadioSwitchProps {
    name?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    required?: boolean;
    label?: string;
    values: SimpleObject<string>[];
    defaultValue?: string;
    description?: string;
    errorMessage?: string;
    invalid?: boolean;
}

export const AppFormRadioSwitch: FC<AppFormRadioSwitchProps> = ({
    name,
    errorMessage,
    label = "",
    values,
    defaultValue,
    description,
    md,
    sm,
    lg,
    xl,
    invalid = false,
    required = false,
}): JSX.Element => {
    const renderOptions = () => {
        return values.map((e, i) => {
            return (
                <Form.Check
                    key={i}
                    type="radio"
                    id={`option_${i}`}
                    required={required}
                    label={e.label}
                    value={e.value}
                    name={name}
                    defaultChecked={defaultValue === e.value}
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
