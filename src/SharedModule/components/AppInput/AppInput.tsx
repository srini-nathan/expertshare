import React from "react";
import { Input } from "@bootstrap-styled/v4";
import styled from "styled-components";

export interface AppInputProps {
    /**
     * Choose to change size of the input
     */
    size?: "sm" | "lg";
    placeholder?: string;
    type?:
        | "text"
        | "number"
        | "email"
        | "search"
        | "password"
        | "color"
        | "date"
        | "time";
    state?: "success" | "warning" | "danger";
    disabled?: boolean;
    className?: string;
    readOnly?: boolean;
}

const ColorInput = styled(Input)`
    min-width: 50px;
`;
/**
 * Form Input component to get input from user
 */
export const AppInput: React.FC<AppInputProps> = ({
    type = "text",
    placeholder = "Text Input",
    ...props
}) => {
    if (type === "color") {
        return <ColorInput type={type} placeholder={placeholder} {...props} />;
    }

    return <Input type={type} placeholder={placeholder} {...props} />;
};
