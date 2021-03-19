import React, { FC } from "react";
import "./style.scss";
import { FieldElement, Ref } from "react-hook-form/dist/types/fields";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

export interface CustomCheckBoxProps {
    label: string;
    name: string;
    labelPosition: string;
    value: string;
    register<TFieldElement extends FieldElement<TFieldElement>>(
        ref: (TFieldElement & Ref) | null,
        rules?: RegisterOptions
    ): void;
    defaultChecked?: boolean;
}

export const CustomCheckBox: FC<CustomCheckBoxProps> = ({
    label,
    name,
    labelPosition,
    value,
    register,
    // defaultChecked,
}): JSX.Element => {
    const renderClass = () => {
        switch (labelPosition) {
            case "top":
                return "custom-checkbox d-flex flex-column align-items-center align-items-sm-start mb-3";
            case "left":
            default:
                return "custom-checkbox theme-checkbox-block-bg-clr theme-checkbox-block-border-radius d-flex flex-column justify-content-end h-100 flex-sm-row text-center justify-content-sm-between align-items-center";
        }
    };

    return (
        <div className="col-6 col-xl-4 pr-xl-5 mb-4">
            <div className={renderClass()}>
                <div className="normal-label theme-label-clr mb-1 mb-sm-0">
                    {label}
                </div>
                <input
                    className="d-none theme-checkbox-bg-clr"
                    type="checkbox"
                    id={name}
                    name={name}
                    value={value}
                    ref={register}
                    // defaultChecked={defaultChecked}
                />
                <label
                    className="position-relative mb-0"
                    htmlFor={name}
                ></label>
            </div>
        </div>
    );
};

export default CustomCheckBox;
