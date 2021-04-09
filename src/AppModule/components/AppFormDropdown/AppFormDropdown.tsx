import React, { ChangeEventHandler, FC } from "react";
import { Form } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppFormDropdownProps {
    id: string;
    value: string | string[] | number;
    label?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    size?: "lg" | "sm";
}

export const AppFormDropdown: FC<AppFormDropdownProps> = ({
    id,
    value,
    label = "",
    size,
    onChange = () => {},
}): JSX.Element => {
    return (
        <Form.Group controlId={id}>
            <Form.Label>{{ label }}</Form.Label>
            <Form.Control
                as="select"
                custom
                onChange={onChange}
                value={value}
                size={size}
            >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </Form.Control>
        </Form.Group>
    );
};
