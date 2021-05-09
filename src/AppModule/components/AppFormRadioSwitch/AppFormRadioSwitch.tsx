import React, { FC } from "react";
import { Col, Form } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import "./assets/scss/style.scss";

export interface AppFormRadioSwitchProps {
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            className="button-group p-0"
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
        >
            <Controller
                control={control}
                name={fieldName}
                render={({ field: { onChange, name } }) => (
                    <Form.Check id={`radioValue_${radioValue}`} type={"radio"}>
                        <Form.Control
                            onChange={onChange}
                            value={radioValue}
                            defaultChecked={defaultChecked}
                            name={name}
                            type={"radio"}
                        />
                        <Form.Check.Label>{label}</Form.Check.Label>
                    </Form.Check>
                )}
            />
        </Form.Group>
    );
};
