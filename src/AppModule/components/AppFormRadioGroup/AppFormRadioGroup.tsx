import React, { ChangeEventHandler, FC } from "react";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { Controller, Control } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormRadioGroupProps {
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

export const AppFormRadioGroup: FC<AppFormRadioGroupProps> = ({
    id,
    value,
    name,
    defaultChecked = false,
    label = "",
    control,
}): JSX.Element => {
    let props: any = {
        id,
        label,
        value,
    };
    if (defaultChecked)
        props = {
            ...props,
            defaultChecked,
        };
    return (
        <Controller
            name={name}
            defaultValue={value}
            control={control}
            render={({ field }) => (
                <Form.Check {...field} type="radio" {...props} />
            )}
        />
    );
};
