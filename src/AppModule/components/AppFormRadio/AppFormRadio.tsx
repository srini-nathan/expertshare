import React, { ChangeEventHandler, FC } from "react";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormRadioProps {
    id: string;
    name: string;
    value: boolean;
    label?: string;
    onChange?: ChangeEventHandler;
}

export const AppFormRadio: FC<AppFormRadioProps> = ({
    id,
    name,
    value,
    label = "",
    onChange = () => {},
}): JSX.Element => {
    return (
        <Form.Check
            type="radio"
            label={label}
            name={name}
            defaultChecked={value}
            id={`radio_${id}`}
            onChange={(event) => onChange(event)}
        />
    );
};
