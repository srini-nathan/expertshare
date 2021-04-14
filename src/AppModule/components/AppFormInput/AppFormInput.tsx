import React, { FC } from "react";
import { Form, Col } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormInputProps {
    id: string;
    name: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    col?: string;
    value?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    label?: string;
    description?: string;
    errorMessage?: string;
    invalid?: boolean;
    withCounter?: boolean;
    maxCount?: number;
}

export const AppFormInput: FC<AppFormInputProps> = ({
    id,
    name,
    value = "",
    placeholder,
    errorMessage,
    label = "",
    type = "text",
    description,
    md,
    sm,
    lg,
    xl,
    invalid = false,
    required = false,
    withCounter = false,
    maxCount = 25,
}): JSX.Element => {
    const [input, setInput] = React.useState<string>(value);
    return (
        <Form.Group as={Col} md={md} sm={sm} lg={lg} xl={xl} controlId={id}>
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
                {(withCounter || maxCount !== 25) && (
                    <span className="counter">{`${input.length}/${maxCount}`}</span>
                )}
            </Form.Label>
            <Form.Control
                required={required}
                type={type}
                placeholder={placeholder}
                value={input}
                name={name}
                maxLength={withCounter || maxCount !== 25 ? maxCount : -1}
                onChange={(e) => setInput(e.target.value)}
            />
            {invalid && (
                <Form.Control.Feedback type="invalid">
                    {errorMessage}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};
