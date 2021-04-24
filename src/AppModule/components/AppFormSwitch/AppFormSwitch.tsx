import React, { FC } from "react";
import { Form, Col, FormCheck } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import "./assets/scss/style.scss";

export interface AppFormSwitchProps {
    id?: string;
    name: string;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    // value?: boolean;
    type?: string;
    required?: boolean;
    label?: string;
    description?: string;
    errorMessage?: string;
    isInvalid?: boolean;
    isValid?: boolean;
    control?: Control<any>;
    defaultChecked?: boolean;
}

export const AppFormSwitch: FC<AppFormSwitchProps> = ({
    id,
    name,
    // value,
    errorMessage,
    label = "",
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    required = false,
    control,
    isValid,
    isInvalid,
}): JSX.Element => {
    const controlId = id || name;

    let classes = "lg ";
    classes += isInvalid ? "is-invalid" : "";
    classes += isValid ? "is-valid" : "";

    return (
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            controlId={controlId}
        >
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
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <FormCheck
                        inline={true}
                        type="switch"
                        className={classes}
                        {...field}
                    />
                )}
            />
            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
