import React, { FC, useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Form, Col } from "react-bootstrap";
import { AppMultiSelect } from "../AppMultiSelect";

import "./assets/scss/style.scss";

export interface AppFormMultiSelectProps {
    id: string;
    name: string;
    defaultValue: string[];
    placeholder?: string;
    label?: string;
    isObjectOptions?: boolean;
    size?: "lg" | "sm";
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    options: string[];
    required?: boolean;
    className?: string;
    description?: string;
    errorMessage?: string;
    control?: Control<any>;
}

export const AppFormMultiSelect: FC<AppFormMultiSelectProps> = ({
    id,
    name,
    defaultValue,
    placeholder = "",
    options,
    className = "",
    control,
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    required = false,
    errorMessage,
    label = "",
    isObjectOptions = false,
}): JSX.Element => {
    const controlId = id || name;
    const [selectedOptions, setSelectedOptions] = useState(defaultValue || []);

    useEffect(() => {
        setSelectedOptions(defaultValue);
    }, [defaultValue]);

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            controlId={controlId}
            className={`mb-0 ${className}`}
        >
            {label?.length > 0 ? (
                <Form.Label>
                    {label}
                    {required && <span className="required">*</span>}
                    {description && (
                        <div className="custom-input-description">
                            <span>i</span>
                            <div className="custom-input-description-content">
                                {description}
                            </div>
                        </div>
                    )}
                </Form.Label>
            ) : null}
            <Controller
                name={name}
                control={control}
                defaultValue={selectedOptions}
                render={({ field }) => (
                    <AppMultiSelect
                        {...field}
                        selectedItems={selectedOptions}
                        options={options}
                        placeholder={placeholder}
                        isObjectOptions={isObjectOptions}
                        onChange={(e: string) => {
                            const index = selectedOptions.indexOf(e);
                            if (index !== -1) {
                                const selectedOptionsCopy = selectedOptions;
                                selectedOptionsCopy.splice(index, 1);
                                setSelectedOptions([...selectedOptionsCopy]);
                                field.onChange(selectedOptionsCopy);
                            } else {
                                const selectedOptionsCopy = [
                                    ...selectedOptions,
                                    e,
                                ];
                                setSelectedOptions(selectedOptionsCopy);
                                field.onChange(selectedOptionsCopy);
                            }
                        }}
                    ></AppMultiSelect>
                )}
            />
            <span className="invalid-feedback d-block">
                {errorMessage && errorMessage}
            </span>
        </Form.Group>
    );
};
