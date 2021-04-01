import React, { FC } from "react";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import "./style.scss";

export interface TextInputProps {
    label: string;
    name: string;
    type: string;
    limit: boolean;
    maxCount: number;
    register<TFieldElement extends FieldElement<TFieldElement>>(
        ref: (TFieldElement & Ref) | null,
        rules?: RegisterOptions
    ): void;
    invalid: boolean;
    message: string;
    placeholder: string;
}

export const TextInput: FC<TextInputProps> = ({
    label,
    name,
    type,
    register,
    invalid,
    message,
    placeholder,
    limit,
    maxCount,
}): JSX.Element => {
    return (
        <div className="col-12 col-sm-9 col-xl-4 mr-xl-1 px-0 input-wrap-pr">
            <div className="d-flex flex-wrap justify-content-between mb-4">
                <label
                    className="light-label theme-label-clr m-0"
                    htmlFor="edit-name"
                >
                    {label}
                </label>
                {limit && (
                    <span className="input-letter-counter theme-input-letter-counter-clr">
                        0/{maxCount}
                    </span>
                )}
                <input
                    className="mt-1 mb-0"
                    type={type}
                    name={name}
                    ref={register}
                    placeholder={placeholder}
                />
                {invalid && <div className="invalid-feedback">{message}</div>}
            </div>
        </div>
    );
};

export default TextInput;
