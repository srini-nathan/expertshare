import React, { FC } from "react";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppSwitchProps {
    value: string | number;
    name?: string;
    defaultChecked?: boolean;
    label?: string;
}

export const AppSwitch: FC<AppSwitchProps> = ({
    name,
    value,
    defaultChecked = false,
    label = "",
}): JSX.Element => {
    return (
        <Form.Check
            type="switch"
            label={label}
            name={name}
            value={value}
            defaultChecked={defaultChecked}
            id={name}
        />
    );
};
