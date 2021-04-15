import React, { ChangeEventHandler, FC } from "react";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormRadioProps {
    id: string;
    name: string;
    value: boolean;
    label?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
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
            id={`radio_${id}`}
            name={name}
            defaultChecked={value}
            label={label}
            onChange={onChange}
        />
    );
};
