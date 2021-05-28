import React, { ChangeEventHandler, FC } from "react";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { Controller, Control } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormCheckBoxGroupProps {
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
    control: Control<any>;
}

export const AppFormCheckBoxGroup: FC<AppFormCheckBoxGroupProps> = ({
    id,
    name,
    defaultChecked = false,
    label = "",
    control,
}): JSX.Element => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultChecked}
            render={({ field }) => (
                <Form.Check id={id} type="checkbox" {...field} label={label} />
            )}
        />
    );
};
