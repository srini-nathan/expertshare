import React, { ChangeEventHandler, FC } from "react";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { Controller, Control } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormRadioGroupProps {
    name: string;
    defaultValue?: any;
    options?: any[];
    onChange?: ChangeEventHandler<HTMLInputElement>;
    register?<TFieldElement extends FieldElement<TFieldElement>>(
        ref?: (TFieldElement & Ref) | null,
        rules?: RegisterOptions
    ): void;
    control: Control<any>;
    setValue: any;
}

export const AppFormRadioGroup: FC<AppFormRadioGroupProps> = ({
    name,
    control,
    options,
    defaultValue,
    setValue,
}): JSX.Element => {
    return (
        <>
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue ? defaultValue.value : ""}
                render={() => <input type="hidden" name={name} />}
            />
            {options?.map((e) => {
                return (
                    <Form.Check
                        key={e.value}
                        id={`radio_${e.value}`}
                        name={`radio_${e.name}`}
                        className={"circle-radio-button"}
                        onChange={(element) => {
                            setValue(name, element.target.value, {});
                        }}
                        type={"radio"}
                        defaultValue={e.value}
                        label={e.label}
                        defaultChecked={e.defaultCheck}
                    />
                );
            })}
        </>
    );
};
