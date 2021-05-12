import React, { FC } from "react";
import { Form, Col } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppTextAreaProps {
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    placeholder?: string | boolean;
    className?: string;
    label?: string;
    name: string;
    defaultValue?: string;
    description?: string;
    rows?: number;
    required?: boolean;
    onChange?: (value: string) => void;
}

export const AppTextArea: FC<AppTextAreaProps> = ({
    label = "",
    name = "",
    defaultValue = "",
    placeholder = "",
    className = "",
    required,
    description,
    onChange = () => {},
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    rows = 5,
}): JSX.Element => {
    return (
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            className={className}
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
            <Form.Control
                name={name}
                onChange={(e) => onChange(e.target.value)}
                defaultValue={defaultValue}
                as={"textarea"}
                placeholder={placeholder}
                rows={rows}
            />
        </Form.Group>
    );
};
