import React, { ChangeEventHandler, FC } from "react";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { Controller, Control } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormCheckBox2Props {
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
    options: any[];
}

export const AppFormCheckBox2: FC<AppFormCheckBox2Props> = ({
    name,
    value,
    control,
    options,
}): JSX.Element => {
    return (
        <Controller
            control={control}
            name={`${name}`}
            defaultValue={value}
            render={({ field }) => (
                <>
                    {options.map((e) => {
                        return (
                            <Form.Check
                                id={e.value}
                                {...field}
                                defaultChecked={e.defaultChecked}
                                label={e.label}
                            />
                        );
                    })}
                </>
            )}
        />
    );
};
