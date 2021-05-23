import React, { FunctionComponent, ReactNode } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppButtonProps extends ButtonProps {
    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "dark"
        | "light"
        | "link"
        | "outline-primary"
        | "outline-secondary"
        | "outline-success"
        | "outline-danger"
        | "outline-warning"
        | "outline-info"
        | "outline-dark"
        | "outline-light";
    submit?: boolean;
    reset?: boolean;
    children?: ReactNode;
    className?: string;
    size?: "sm" | "lg";
    block?: boolean;
    disabled?: boolean;
    handleClick?: () => void;
}
export const AppButton: FunctionComponent<AppButtonProps> = ({
    submit = false,
    reset = false,
    type = "button",
    handleClick,
    ...props
}) => {
    let btnType = type;
    if (reset) {
        btnType = "reset";
    }
    if (submit) {
        btnType = "submit";
    }

    return (
        <Button type={btnType} onClick={handleClick} {...props}>
            {props.children}
        </Button>
    );
};
