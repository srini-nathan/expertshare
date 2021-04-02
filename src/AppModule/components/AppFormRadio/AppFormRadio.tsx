import React, { FC } from "react";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormRadioProps {
    id: string;
    name: string;
    value: string | number;
    defaultChecked?: boolean;
    label?: string;
}

export const AppFormRadio: FC<AppFormRadioProps> = ({
    id,
    name,
    value,
    defaultChecked = false,
    label = "",
}): JSX.Element => {
    return (
        <Form.Check
            type="radio"
            label={label}
            name={name}
            value={value}
            defaultChecked={defaultChecked}
            id={id}
        />
    );
};
