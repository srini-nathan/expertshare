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
    isLoading?: boolean;
    loadingTxt?: string;
}
export const AppButton: FunctionComponent<AppButtonProps> = ({
    submit = false,
    reset = false,
    type = "button",
    isLoading,
    loadingTxt = "Saving...",
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Button type={btnType} {...props}>
            {isLoading ? loadingTxt : props.children}
        </Button>
    );
};
