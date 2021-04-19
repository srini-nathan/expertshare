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
    length: number;
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
    length = 0,
}): JSX.Element => {
    return (
        <div className="col-12 col-sm-6 col-xl-4 col-md-4  px-3 input-wrap-pr">
            <div className="d-flex flex-wrap justify-content-between mb-4">
                <label className="light-label m-0" htmlFor="edit-name">
                    {label}
                </label>
                {limit && (
                    <span className="input-letter-counter">
                        {length}/{maxCount}
                    </span>
                )}
                <input
                    className={`mt-1 mb-0 ${invalid && " is-invalid"}`}
                    type={type}
                    name={name}
                    ref={register}
                    placeholder={placeholder}
                    maxLength={maxCount}
                />
                {invalid && <div className="invalid-feedback">{message}</div>}
            </div>
        </div>
    );
};

export default TextInput;
