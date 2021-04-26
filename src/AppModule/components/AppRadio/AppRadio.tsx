import React, { ChangeEventHandler, FC } from "react";
import { Form } from "react-bootstrap";

import "./assets/scss/style.scss";

export interface AppRadioProps {
    id: string;
    name: string;
    defaultChecked: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const AppRadio: FC<AppRadioProps> = ({
    id,
    name,
    defaultChecked,
    onChange = () => {},
}): JSX.Element => {
    return (
        <Form.Check
            type="radio"
            id={id}
            name={name}
            label={""}
            defaultChecked={defaultChecked}
            onInput={onChange}
            inline
        />
    );
};
