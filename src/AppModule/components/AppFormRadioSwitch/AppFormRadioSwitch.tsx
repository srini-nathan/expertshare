import React, { FC } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import "./assets/scss/style.scss";

export interface AppFormRadioSwitchProps {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    label: string;
    control: Control<any>;
    fieldName: string;
    radioValue: string;
    defaultChecked?: boolean;
}

export const AppFormRadioSwitch: FC<AppFormRadioSwitchProps> = ({
    fieldName,
    label = "",
    radioValue,
    md,
    sm,
    lg,
    xl,
    control,
    defaultChecked = false,
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
            <Form.Label>{label}</Form.Label>
            <Row className="button-group-buttons m-0">
                <Controller
                    control={control}
                    name={fieldName}
                    render={({ field: { onChange, name } }) => (
                        <input
                            type="radio"
                            name={name}
                            value={radioValue}
                            defaultChecked={defaultChecked}
                            onChange={onChange}
                        />
                    )}
                />
            </Row>
        </Form.Group>
    );
};
