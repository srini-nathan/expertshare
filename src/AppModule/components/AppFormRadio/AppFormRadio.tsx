import React, { ChangeEventHandler, FC } from "react";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormRadioProps {
    id: string;
    name: string;
    value?: string;
    defaultChecked?: boolean;
    label?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    register?<TFieldElement extends FieldElement<TFieldElement>>(
        ref?: (TFieldElement & Ref) | null,
        rules?: RegisterOptions
    ): void;
}

export const AppFormRadio: FC<AppFormRadioProps> = ({
    id,
    name,
    value,
    defaultChecked = false,
    label = "",
    register,
    onChange = () => {},
}): JSX.Element => {
    return (
        <Form.Check
            type="radio"
            id={`radio_${id}`}
            className={`circle-radio-button`}
            name={name}
            value={value}
            defaultChecked={defaultChecked}
            label={label}
            onChange={onChange}
            ref={register}
        />
    );
};
